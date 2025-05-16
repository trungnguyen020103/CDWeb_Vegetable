export const findProductNameById = (productId) => {
    const product = products.find(prod => prod.id === productId);
    return product ? product.name : '';
};
export const findProductImgById = (productId) => {
    const product = products.find(prod => prod.id === productId);
    return product ? product.img : '';
};
export const findProductPriceById = (productId) => {
    const product = products.find(prod => prod.id === productId);
    return product ? product.price : '';
};

export const products = [
    {
        id: 1,
        name: 'Đồng phục vest nữ VW20108',
        img: 'https://dongphucvikor.com/wp-content/uploads/2022/01/V13124-1-scaled-600x900.jpg',
        des: 'Đồng phục vest nữ cổ danton truyền thống, form áo được cải tiến với độ ôm vừa vặn với cơ thể, tạo sự thoải mái và tự tin cho người mặc.Form áo trẻ trung và hiện đại, thể hiện sự sang trọng, chuyên nghiệp và nâng tầm hình ảnh thương hiệu.Thiết kế đề cao tiêu chí: đẹp, dễ mặc, tôn dáng, che khuyết điểm và phù hợp với mọi dáng người.Màu đen sang trọng phù hợp với đồng phục doanh nghiệp ở các lĩnh vực ngành nghề kinh doanh, tư vấn khách hàng như: Ngân hàng, Tài chính, Bất động sản, Bảo hiểm, Sale, Quản lý,…Mẫu được thiết kế độc quyền bởi VIKOR và trưng bày trực tiếp tại Showroom. Khách hàng có cơ hội trải nghiệm sản phẩm thực tế và đáp ứng nhanh nhu cầu đồng phục từ 01 bộ.Kỹ thuật tạo form và may thủ công chuyên nghiệp từ thợ may vest tay nghề cao, sắc nét và tinh tế đến từng đường kim mũi chỉ.Chất liệu Cashmere cao cấp, đứng form, không nhăn, không xù lông, độ bền cao, co giãn nhẹ, thoáng mát, thấm hút mồ hôi, tạo cảm giác thoải mái khi mặc.Khách hàng có thểĐặt may đồng phục theo yêu cầuvới các dịch vụ:Thiết kế mẫu riêng theo yêu cầuTư vấn và thiết kế miễn phí đối với các đơn hàng sản xuấtTư vấn chất liệu dựa theo kiểu dáng và ngân sách của khách hàngMàu sắc có thể thay đổi dựa trên Catalogue vải.May đo 3D tận nơi.Thêu logo thương hiệu theo yêu cầu.',
        price: 1100000,
        bestSeller: true,
        category: 'Đồng phục ngành Kinh doanh/Tư vấn',
    },
    {
        id: 2,
        name: 'Đồng phục Vest nữ VW13601',
        img: 'https://dongphucvikor.com/wp-content/uploads/2021/01/V13133-1-scaled-600x900.jpg',
        des: 'Đồng phục vest nữ không lá cổ, tà xẻ xếp ly hiện đại, form áo được cải tiến với độ ôm vừa vặn với cơ thể, tạo sự thoải mái và tự tin cho người mặc.Form áo trẻ trung và hiện đại, thể hiện sự sang trọng, chuyên nghiệp và nâng tầm hình ảnh thương hiệu.Thiết kế đề cao tiêu chí: đẹp, dễ mặc, tôn dáng, che khuyết điểm và phù hợp với mọi dáng người.Màu đen sang trọng phù hợp với đồng phục doanh nghiệp ở các lĩnh vực ngành nghề kinh doanh, tư vấn khách hàng như: Ngân hàng, Tài chính, Bất động sản, Bảo hiểm, Sale, Quản lý,…Mẫu được thiết kế độc quyền bởi VIKOR và trưng bày trực tiếp tại Showroom. Khách hàng có cơ hội trải nghiệm sản phẩm thực tế và đáp ứng nhanh nhu cầu đồng phục từ 01 bộ.Kỹ thuật tạo form và may thủ công chuyên nghiệp từ thợ may vest tay nghề cao, sắc nét và tinh tế đến từng đường kim mũi chỉ.Chất liệu Ruby Hàn Quốc cao cấp, đứng form, không nhăn, không xù lông, độ bền cao, co giãn nhẹ, thoáng mát, thấm hút mồ hôi, tạo cảm giác thoải mái khi mặc.Khách hàng có thểĐặt may đồng phục theo yêu cầuvới các dịch vụ:Thiết kế mẫu riêng theo yêu cầuTư vấn và thiết kế miễn phí đối với các đơn hàng sản xuấtTư vấn chất liệu dựa theo kiểu dáng và ngân sách của khách hàngMàu sắc có thể thay đổi dựa trên Catalogue vải.May đo 3D tận nơi.Thêu logo thương hiệu theo yêu cầu.',
        price: 1100000,
        bestSeller: true,
        category: 'Đồng phục quản lý nhà hàng',
    },

];