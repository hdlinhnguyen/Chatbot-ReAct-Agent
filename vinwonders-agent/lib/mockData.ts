export interface Destination {
    id: string;
    name: string;
    type: 'ride' | 'restaurant' | 'facility' | 'hotel' | 'show' | 'contact';
    location?: string;
    description: string;
    tip?: string;
    contact_number?: string;
    operating_hours?: string;
  }
  
  export const mockData: Destination[] = [
    // ================= RIDES & ATTRACTIONS (Trò chơi & Khu tham quan) =================
    {
      id: "ride-01",
      name: "Cơn thịnh nộ của Zeus (Thrill Ride)",
      type: "ride",
      location: "Khu Thế giới Phiêu lưu",
      description: "Tàu lượn siêu tốc tốc độ cao nhất thế giới với các vòng lộn ngược đứng tim. Vận tốc lên đến 110km/h.",
      tip: "Hạn chế cho người có tiền sử tim mạch hoặc chóng mặt. Yêu cầu chiều cao tối thiểu 140cm.",
      operating_hours: "09:00 - 18:00"
    },
    {
      id: "ride-02",
      name: "Cung điện Hải Vương (Thủy cung)",
      type: "facility",
      location: "Khu Đại dương",
      description: "Thủy cung hình rùa khổng lồ, không gian máy lạnh mát mẻ, lý tưởng để trú khi trời mưa to hoặc nắng gắt.",
      tip: "Nên kết hợp xem show diễn cho cá ăn vào buổi trưa.",
      operating_hours: "10:00 - 18:00"
    },
    {
      id: "ride-03",
      name: "River Safari",
      type: "facility",
      location: "Khu Safari",
      description: "Công viên chăm sóc và bảo tồn động vật bán hoang dã trên sông đầu tiên tại Việt Nam. Trải nghiệm đi thuyền ngắm động vật.",
      tip: "Nên đi vào buổi sáng sớm (9:00) hoặc xế chiều (15:00) khi động vật hoạt động nhiều nhất.",
      operating_hours: "09:00 - 16:30"
    },
    {
      id: "ride-04",
      name: "Vòng quay Mặt Trời (Sky Wheel)",
      type: "ride",
      location: "Khu Trung tâm",
      description: "Vòng quay khổng lồ mang đến tầm nhìn toàn cảnh VinWonders từ trên cao. Cực kỳ lãng mạn cho các cặp đôi.",
      tip: "Nên đi vào lúc hoàng hôn (khoảng 17:00) để có những bức ảnh đẹp nhất.",
      operating_hours: "10:00 - 19:30"
    },
  
    // ================= SHOWS (Biểu diễn) =================
    {
      id: "show-01",
      name: "Tata Show",
      type: "show",
      location: "Quảng trường Thần Thoại",
      description: "Show diễn thực cảnh đa phương tiện hoành tráng nhất, kết hợp mapping 3D, ánh sáng, khói lửa và hàng trăm diễn viên.",
      tip: "Đến sớm 20 phút để lấy chỗ ngồi chính giữa đài phun nước.",
      operating_hours: "19:30 - 20:15"
    },
    {
      id: "show-02",
      name: "Show Nàng Tiên Cá",
      type: "show",
      location: "Bể chính - Cung điện Hải Vương",
      description: "Trình diễn bơi lội nghệ thuật của các nàng tiên cá dưới đại dương thu nhỏ.",
      tip: "Rất phù hợp cho gia đình có trẻ em.",
      operating_hours: "11:00 - 11:15 & 15:00 - 15:15"
    },
  
    // ================= RESTAURANTS (Nhà hàng) =================
    {
      id: "res-01",
      name: "Nhà hàng Hải Vương",
      type: "restaurant",
      location: "Tầng 1 - Cung điện Hải Vương",
      description: "Nhà hàng buffet và gọi món hải sản cao cấp, không gian mát mẻ có view nhìn ra bể cá kính khổng lồ.",
      tip: "Nên đặt bàn trước 30 phút qua app để tránh cao điểm lúc 12:30.",
      operating_hours: "10:00 - 20:00"
    },
    {
      id: "res-02",
      name: "Yummy Land Fastfood",
      type: "restaurant",
      location: "Khu Công viên nước",
      description: "Phục vụ đồ ăn nhanh: Gà rán, hamburger, pizza, xúc xích và nước ngọt. Tiện lợi, phục vụ nhanh chóng.",
      tip: "Giải pháp nhanh gọn nhất khi trẻ em bị đói sau khi bơi.",
      operating_hours: "09:30 - 18:00"
    },
    {
      id: "res-03",
      name: "Chợ Ẩm Thực Ba Miền",
      type: "restaurant",
      location: "Khu Phố Cổ",
      description: "Các gian hàng phục vụ các món ăn truyền thống Việt Nam: Phở, bún chả, bánh xèo, chè tráng miệng.",
      tip: "Phù hợp cho gia đình có người lớn tuổi thích đồ ăn truyền thống.",
      operating_hours: "10:00 - 21:00"
    },
  
    // ================= HOTELS (Khách sạn) =================
    {
      id: "hotel-01",
      name: "Vinpearl Resort & Spa",
      type: "hotel",
      location: "Khu Vịnh",
      description: "Khu nghỉ dưỡng 5 sao tiêu chuẩn quốc tế với bãi biển riêng, hồ bơi siêu lớn và dịch vụ spa chăm sóc sức khỏe.",
      contact_number: "1900 1901"
    },
    {
      id: "hotel-02",
      name: "VinHolidays Fiesta",
      type: "hotel",
      location: "Khu Grand World",
      description: "Khách sạn phong cách tối giản, trẻ trung, nằm ngay trung tâm thành phố không ngủ, tiện lợi cho việc di chuyển vui chơi.",
      contact_number: "1900 1902"
    },
  
    // ================= CONTACTS / EMERGENCIES (Danh bạ khẩn cấp) =================
    {
      id: "contact-01",
      name: "Phòng Y Tế Chữ Thập Đỏ",
      type: "contact",
      location: "Cổng chính & Khu Công viên nước",
      description: "Xử lý các tình huống khẩn cấp về sức khỏe: say nắng, trầy xước, chóng mặt, cấp cứu. Có sẵn xe điện hỗ trợ di chuyển.",
      contact_number: "0297 384 1111",
      tip: "Liên hệ ngay nếu khách có biểu hiện kiệt sức, đừng tự di chuyển dưới trời nắng."
    },
    {
      id: "contact-02",
      name: "Quầy An Ninh & Thất Lạc Đồ (Lost & Found)",
      type: "contact",
      location: "Quầy thông tin Cổng chính",
      description: "Nơi tiếp nhận và xử lý các báo cáo mất tài sản (điện thoại, ví tiền) hoặc trẻ em đi lạc trong khuôn viên.",
      contact_number: "0297 384 2222",
      tip: "Hệ thống có thể tự động tạo vé báo mất (Ticket) và thông báo qua bộ đàm cho toàn bộ nhân viên mặt đất."
    },
    {
      id: "contact-03",
      name: "Tổng đài Chăm sóc khách hàng VinWonders",
      type: "contact",
      location: "Toàn hệ thống",
      description: "Giải đáp thắc mắc về giá vé, chính sách hoàn hủy, phản ánh chất lượng dịch vụ hoặc cần xe điện đón tận nơi.",
      contact_number: "1900 6677",
      operating_hours: "08:00 - 22:00"
    }
  ];