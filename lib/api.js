// Manga data from HangTruyen
const mangaData = [
  {
    id: 'one-punch-man',
    title: 'One Punch Man',
    author: 'ONE, Yusuke Murata',
    genre: 'Action',
    description: 'Thánh Phồng Tôm, Một đấm là nằm, v.v... Tất cả những biệt danh đó nhằm ám chỉ đến tên hói Saitama, người rèn luyện bản thân mình đến hói cả đầu để trở thành siêu anh hùng. Hãy đến với HangTruyen để xem có bao nhiêu main sẽ bị thay bởi boss nhé!',
    image: 'https://img.htrcdn.com/90htr/posters/2024.11.13/eFBaGhXD2T5EBvM4el.jpg',
    content: [
      'Chương 1: Người hùng sở thích',
      'Chương 2: Cyborg',
      'Chương 3: Hiệp hội anh hùng',
      'Chương 4: Thử thách S-Class',
      'Chương 5: Quái vật biển sâu'
    ],
    tags: ['action', 'superhero', 'comedy'],
    views: 15601,
    likes: 421,
    status: 'ongoing',
    grade: 'Shounen'
  },
  {
    id: 'kaiju-no-8',
    title: 'Kaiju No.8',
    author: 'Naoya Matsumoto',
    genre: 'Action',
    description: 'Kafka Hibino, 32 tuổi, là một người đàn ông làm cho Tập đoàn Vệ sinh Kaiju Chuyên nghiệp. Anh được giao nhiệm vụ xử lý xác của đám Kaiju, một giống loại quái vật kỳ dị giống Godzilla, sau khi bị tiêu diệt bởi Lực lượng Phòng vệ. Tuy nhiên, Kafka không hề hài lòng với công việc xử lý xác của mình.',
    image: 'https://img.htrcdn.com/90htr/posters/62/66/kaiju-no-8.jpg',
    content: [
      'Chương 1: Người dọn dẹp Kaiju',
      'Chương 2: Biến thành quái vật',
      'Chương 3: Lực lượng phòng vệ',
      'Chương 4: Kỳ thi tuyển chọn',
      'Chương 5: Sức mạnh ẩn giấu'
    ],
    tags: ['action', 'monster', 'military'],
    views: 12450,
    likes: 356,
    status: 'ongoing',
    grade: 'Seinen'
  },
  {
    id: 'demon-slayer',
    title: 'Thanh Gươm Diệt Quỷ',
    author: 'Koyoharu Gotouge',
    genre: 'Action',
    description: 'Truyện tranh Thanh Gươm Diệt Quỷ là một bộ manga nổi tiếng của tác giả Koyoharu Gotouge, xoay quanh hành trình chiến đấu chống lại quỷ dữ của thiếu niên Kamado Tanjirou. Câu chuyện bắt đầu khi Tanjirou trở về nhà sau một chuyến đi bán than và phát hiện cả gia đình mình bị thảm sát bởi quỷ.',
    image: 'https://img.htrcdn.com/90htr/posters/9f/ad/thanh-guom-diet-quy.png',
    content: [
      'Chương 1: Gia đình bị thảm sát',
      'Chương 2: Nezuko biến thành quỷ',
      'Chương 3: Gặp Urokodaki',
      'Chương 4: Kỳ thi Final Selection',
      'Chương 5: Nhiệm vụ đầu tiên'
    ],
    tags: ['action', 'demon', 'historical'],
    views: 18920,
    likes: 567,
    status: 'completed',
    grade: 'Shounen'
  },
  {
    id: 'detective-conan',
    title: 'Thám Tử Conan',
    author: 'Gosho Aoyama',
    genre: 'Mystery',
    description: 'Shinichi Kudo - một học sinh trung học có tài phá án hơn người được, đã giải quyết được một vài vụ án khó khăn. Một hôm, khi đang tuy đuổi nghi phạm, Shinichi bất ngờ bị ép uống một loại thuốc thử nghiệm do tổ chức tội phạm vừa bào chế khiến cậu biến thành một học sinh tiểu học.',
    image: 'https://img.htrcdn.com/90htr/posters/0a/53/tham-tu-conan.jpg',
    content: [
      'Chương 1: Thám tử trung học',
      'Chương 2: Tổ chức áo đen',
      'Chương 3: Thuốc teo nhỏ',
      'Chương 4: Conan Edogawa',
      'Chương 5: Vụ án đầu tiên'
    ],
    tags: ['mystery', 'detective', 'crime'],
    views: 25340,
    likes: 789,
    status: 'ongoing',
    grade: 'Shounen'
  },
  {
    id: 'shangri-la-frontier',
    title: 'Shangri-La Frontier',
    author: 'Katarina, Ryosuke Fuji',
    genre: 'Adventure',
    description: 'Nam sinh Hizutome Rakuro, một game thủ chỉ quan tâm đến một chuyện duy nhất là tìm ra những trò chơi rác và phá đảo chúng. Kỹ năng chơi game của anh đã trở nên bất bại, không ai sánh kịp. Thế nên, khi được giới thiệu về game thực tế ảo VR mới, Shangri-La Frontier, anh đã bắt đầu chơi ngay lập tức.',
    image: 'https://img.htrcdn.com/90htr/posters/b4/61/crappy-game-hunter-challenges-god-tier-game.jpg',
    content: [
      'Chương 1: Game thủ săn game rác',
      'Chương 2: Shangri-La Frontier',
      'Chương 3: Nhân vật Sunraku',
      'Chương 4: Cuộc phiêu lưu bắt đầu',
      'Chương 5: Boss đầu tiên'
    ],
    tags: ['adventure', 'gaming', 'virtual-reality'],
    views: 9876,
    likes: 234,
    status: 'ongoing',
    grade: 'Shounen'
  },
  {
    id: 'fragrant-flower',
    title: 'The Fragrant Flower Blooms With Dignity',
    author: 'Saka Mikami',
    genre: 'Romance',
    description: 'Ở một nơi nào đó, có 2 trường cao trung lân cận. Cao trung Chidori, một trường nam sinh cấp thấp hội tụ đủ những thằng đần, trường nữ sinh Kikyo, một trường nữ sinh danh giá. Rintaro Tsugumi, một nam sinh năm 2 to khỏe và trầm tính tại trường Chidori, bắt gặp Kaoruko Waguri.',
    image: 'https://img.htrcdn.com/90htr/posters/4b/dc/the-fragrant-flower-blooms-with-dignity-kaoru-hana-wa-rin-to-saku.jpg',
    content: [
      'Chương 1: Hai trường đối lập',
      'Chương 2: Cuộc gặp gỡ định mệnh',
      'Chương 3: Cửa hàng bánh',
      'Chương 4: Tình cảm nảy nở',
      'Chương 5: Rào cản xã hội'
    ],
    tags: ['romance', 'school-life', 'drama'],
    views: 7654,
    likes: 198,
    status: 'ongoing',
    grade: 'Shoujo'
  },
  {
    id: 'vo-luyen-dinh-phong',
    title: 'Võ Luyện Đỉnh Phong',
    author: 'Momo',
    genre: 'Martial Arts',
    description: 'Dương Khai được sinh ra trong một thế giới võ hiệp, nơi con người có thể tu luyện để đạt được những loại sức mạnh phi thường. Tuy nhiên, hắn lại là một phế vật chính hiệu, không có kinh mạch đồng nghĩa với không thể tu luyện võ công và thăng tiến sức mạnh.',
    image: 'https://img.htrcdn.com/90htr/posters/c8/1e/vo-luyen-dinh-phong.png',
    content: [
      'Chương 1: Phế vật thiếu gia',
      'Chương 2: Khí Linh Trúc',
      'Chương 3: Khai mở kinh mạch',
      'Chương 4: Tu luyện võ công',
      'Chương 5: Thử thách đầu tiên'
    ],
    tags: ['martial-arts', 'fantasy', 'xuyen-khong'],
    views: 13245,
    likes: 445,
    status: 'completed',
    grade: 'Manhua'
  },
  {
    id: 'ba-chi-em-mikadono',
    title: 'Ba Chị Em Nhà Mikadono Dễ Đối Phó Thật Đấy',
    author: 'Yamakawa Naoto',
    genre: 'Romance',
    description: 'Ayase Yuu là con trai của một nữ diễn viên nổi tiếng và cực kì tài năng. Tuy nhiên, cậu lại chẳng có tài năng gì, dưới trung bình về mọi mặt. Mẹ Yuu mất, cậu được người bạn của mẹ nhận chăm sóc. Ở đó, cậu gặp 3 chị em học cùng trường, những người sở hữu cả tài năng và sắc đẹp.',
    image: 'https://img.htrcdn.com/90htr/posters/2024.10.11/4mvtPfpIaCISHekiAz.jpg',
    content: [
      'Chương 1: Cuộc sống mới',
      'Chương 2: Ba chị em tài năng',
      'Chương 3: Học cùng trường',
      'Chương 4: Tình cảm phức tạp',
      'Chương 5: Lựa chọn khó khăn'
    ],
    tags: ['romance', 'school-life', 'harem'],
    views: 8765,
    likes: 267,
    status: 'ongoing',
    grade: 'Shounen'
  }
];

export async function fetchBooks() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mangaData;
}

export async function fetchBookById(id) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mangaData.find(manga => manga.id === id) || null;
}