// API configuration
const API_BASE_URL = 'https://otruyen-iptv.khotruyen.link';

// Transform API data to our format
function transformMangaData(apiData) {
  if (!apiData || !apiData.channels) {
    return [];
  }

  return apiData.channels.map(channel => {
    const totalChapters = getTotalChapters(channel);
    return {
      id: channel.id,
      title: channel.name || 'Đang cập nhật',
      author: 'Đang cập nhật',
      genre: extractGenreFromTags(channel.name) || 'Khác',
      description: channel.description || 'Đang cập nhật mô tả...',
      image: channel.image?.url || '',
      content: [`${channel.label?.text || 'Tập 1'}: Đang cập nhật nội dung...`],
      tags: extractTagsFromTitle(channel.name),
      views: Math.floor(Math.random() * 50000) + 5000, // Random views for demo
      likes: Math.floor(Math.random() * 2000) + 100,   // Random likes for demo
      status: 'ongoing',
      grade: determineGrade(channel.name),
      chapter: channel.label?.text || 'Tập 1',
      totalChapters: totalChapters,
      chapters: extractChapterList(channel),
      labelColor: channel.label?.color || '#067bcb',
      labelTextColor: channel.label?.text_color || '#e5e7eb',
      labelPosition: channel.label?.position || 'top-left',
      detailUrl: channel.remote_data?.url,
      shareUrl: channel.share?.url
    };
  });
}

// Transform detailed manga data from channel-detail endpoint
function transformDetailedMangaData(apiData) {
  if (!apiData) {
    return null;
  }

  // Extract tags from API
  const apiTags = apiData.tags || [];
  const tags = apiTags.map(tag => tag.text.toLowerCase().replace(/\s+/g, '-'));

  // Extract chapters from sources
  const chapters = [];
  if (apiData.sources && apiData.sources.length > 0) {
    const source = apiData.sources[0];
    if (source.contents && source.contents.length > 0) {
      const content = source.contents[0];
      if (content.streams) {
        // Get first 10 chapters for preview
        content.streams.slice(0, 10).forEach(stream => {
          chapters.push(`${stream.name}: Nội dung chương ${stream.index}`);
        });
      }
    }
  }

  // Determine primary genre from tags
  const primaryGenre = apiTags.length > 0 ? apiTags[0].text : extractGenreFromTags(apiData.name);

  return {
    id: apiData.id,
    title: apiData.name || 'Đang cập nhật',
    author: apiData.author || 'Đang cập nhật',
    genre: primaryGenre,
    description: apiData.description || 'Đang cập nhật mô tả...',
    image: apiData.image?.url || '',
    content: chapters.length > 0 ? chapters : ['Đang cập nhật nội dung...'],
    tags: tags,
    views: Math.floor(Math.random() * 50000) + 5000,
    likes: Math.floor(Math.random() * 2000) + 100,
    status: 'ongoing',
    grade: determineGradeFromTags(apiTags),
    chapter: getLatestChapter(apiData),
    totalChapters: getTotalChapters(apiData),
    chapters: extractChapterList(apiData), // Full chapter list for reading
    labelColor: apiData.label?.color || '#067bcb',
    labelTextColor: apiData.label?.text_color || '#e5e7eb',
    labelPosition: apiData.label?.position || 'top-left',
    detailUrl: apiData.remote_data?.url,
    shareUrl: apiData.share?.url,
    enableDetail: apiData.enable_detail || true
  };
}

// Helper function to get latest chapter
function getLatestChapter(apiData) {
  if (apiData.sources && apiData.sources.length > 0) {
    const source = apiData.sources[0];
    if (source.contents && source.contents.length > 0) {
      const content = source.contents[0];
      if (content.streams && content.streams.length > 0) {
        return content.streams[0].name; // First stream is usually the latest
      }
    }
  }
  return 'Tập 1';
}

// Helper function to get total chapters from label text
function getTotalChapters(apiData) {
  // First try to get from sources (detailed data)
  if (apiData.sources && apiData.sources.length > 0) {
    const source = apiData.sources[0];
    if (source.contents && source.contents.length > 0) {
      const content = source.contents[0];
      if (content.streams) {
        return content.streams.length;
      }
    }
  }

  // Fallback: extract from label text (e.g., "Tập 155" -> 155)
  if (apiData.label && apiData.label.text) {
    const match = apiData.label.text.match(/\d+/);
    if (match) {
      return parseInt(match[0]);
    }
  }

  return 1;
}

// Helper function to extract full chapter list
function extractChapterList(apiData) {
  const chapters = [];

  // First try to get from sources (detailed API data)
  if (apiData.sources && apiData.sources.length > 0) {
    const source = apiData.sources[0];
    if (source.contents && source.contents.length > 0) {
      const content = source.contents[0];
      if (content.streams) {
        content.streams.forEach(stream => {
          chapters.push({
            id: stream.id,
            name: stream.name,
            index: stream.index,
            url: stream.remote_data?.url,
            chapterUid: stream.id,
            comicUid: apiData.id
          });
        });
        return chapters;
      }
    }
  }

  // Fallback: generate chapter list from label text with constructed URLs
  const totalChapters = getTotalChapters(apiData);
  const comicUid = apiData.id;

  for (let i = 1; i <= totalChapters; i++) {
    chapters.push({
      id: `chapter-${i}`,
      name: `Tập ${i}`,
      index: i,
      url: null, // Will be resolved when needed
      chapterUid: null,
      comicUid: comicUid,
      needsDetailFetch: true // Flag to indicate we need to fetch detail first
    });
  }

  return chapters;
}

// Helper function to determine grade from API tags
function determineGradeFromTags(tags) {
  if (!tags || tags.length === 0) return 'Manga';

  const tagTexts = tags.map(tag => tag.text.toLowerCase());

  if (tagTexts.includes('manga')) return 'Manga';
  if (tagTexts.includes('manhwa')) return 'Manhwa';
  if (tagTexts.includes('manhua')) return 'Manhua';

  // Fallback to content-based detection
  const allTags = tagTexts.join(' ');
  if (allTags.includes('romance') || allTags.includes('drama')) return 'Manhwa';
  if (allTags.includes('action') || allTags.includes('fantasy')) return 'Manhua';

  return 'Manga';
}

// Helper functions
function extractGenreFromTags(title) {
  const genreKeywords = {
    'Action': ['chiến', 'đấu', 'giết', 'thợ săn', 'anh hùng', 'chiến đấu'],
    'Romance': ['tình', 'yêu', 'cưới', 'hôn nhân', 'lãng mạn'],
    'Comedy': ['hài', 'vui', 'cười', 'hệ thống', 'lỗi'],
    'Fantasy': ['ma', 'thần', 'pháp', 'huyền', 'tiên', 'quỷ', 'linh'],
    'Drama': ['gia đình', 'cứu', 'bạo', 'bi kịch'],
    'Adventure': ['phiêu lưu', 'kỹ sư', 'thế giới', 'khám phá'],
    'Mystery': ['bí ẩn', 'trinh thám', 'điều tra']
  };

  for (const [genre, keywords] of Object.entries(genreKeywords)) {
    if (keywords.some(keyword => title.toLowerCase().includes(keyword))) {
      return genre;
    }
  }
  return 'Khác';
}

function extractTagsFromTitle(title) {
  const tags = [];
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('ma') || lowerTitle.includes('thần')) tags.push('fantasy');
  if (lowerTitle.includes('chiến') || lowerTitle.includes('đấu')) tags.push('action');
  if (lowerTitle.includes('tình') || lowerTitle.includes('yêu')) tags.push('romance');
  if (lowerTitle.includes('hài') || lowerTitle.includes('lỗi')) tags.push('comedy');
  if (lowerTitle.includes('học')) tags.push('school-life');
  if (lowerTitle.includes('xuyên')) tags.push('xuyen-khong');

  return tags.length > 0 ? tags : ['other'];
}

function determineGrade(title) {
  if (title.includes('Manga') || title.includes('manga')) return 'Manga';
  if (title.includes('Manhwa') || title.includes('manhwa')) return 'Manhwa';
  if (title.includes('Manhua') || title.includes('manhua')) return 'Manhua';

  // Determine by content
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('ma') || lowerTitle.includes('tiên') || lowerTitle.includes('võ')) {
    return 'Manhua';
  }
  if (lowerTitle.includes('học') || lowerTitle.includes('tình')) {
    return 'Manhwa';
  }
  return 'Manga';
}



// API functions
export async function fetchBooks() {
  try {
    const response = await fetch(`${API_BASE_URL}/newest`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformMangaData(data);
  } catch (error) {
    console.error('Error fetching books:', error);

    // Fallback data if API fails
    return getFallbackData();
  }
}

export async function fetchBookById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/channel-detail?uid=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.name) {
      return transformDetailedMangaData(data);
    }

    // If not found, try to get from list
    const books = await fetchBooks();
    return books.find(book => book.id === id) || null;
  } catch (error) {
    console.error('Error fetching book by ID:', error);

    // Fallback: try to get from list
    try {
      const books = await fetchBooks();
      return books.find(book => book.id === id) || null;
    } catch {
      return null;
    }
  }
}

// Fetch chapter content from stream-detail endpoint
export async function fetchChapterContent(chapterUid, comicUid) {
  try {
    const response = await fetch(`${API_BASE_URL}/stream-detail?chapterUid=${chapterUid}&comicUid=${comicUid}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.files) {
      return {
        success: true,
        pages: data.files.map((file, index) => ({
          id: file.id,
          url: file.url,
          name: file.name,
          pageNumber: index + 1
        }))
      };
    }

    return {
      success: false,
      error: 'No content found'
    };
  } catch (error) {
    console.error('Error fetching chapter content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to extract chapter and comic UIDs from stream URL
export function extractUidsFromStreamUrl(streamUrl) {
  try {
    const url = new URL(streamUrl);
    const chapterUid = url.searchParams.get('chapterUid');
    const comicUid = url.searchParams.get('comicUid');

    return { chapterUid, comicUid };
  } catch (error) {
    console.error('Error extracting UIDs from URL:', error);
    return { chapterUid: null, comicUid: null };
  }
}

// Fallback data in case API is down
function getFallbackData() {
  return [
    {
      id: 'fallback-1',
      title: 'API đang bảo trì',
      author: 'Hệ thống',
      genre: 'Thông báo',
      description: 'API đang được bảo trì, vui lòng thử lại sau.',
      image: '',
      content: ['Đang cập nhật...'],
      tags: ['system'],
      views: 0,
      likes: 0,
      status: 'maintenance',
      grade: 'System',
      chapter: 'N/A'
    }
  ];
}