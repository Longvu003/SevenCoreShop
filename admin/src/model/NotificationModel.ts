// NotificationModel.ts

export interface Notification {
    _id: string
    title: string // Tiêu đề thông báo
    description: string // Mô tả nội dung thông báo
    icon?: string // Icon đại diện (tùy chọn)
    createdAt?: Date // Ngày tạo thông báo (tùy chọn)
}
