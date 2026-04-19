using Domain.Enums;
using Domain.Exceptions;

namespace Application.Common;

public class NotificationTemplateContext
{
    public int ResourceId { get; init; }
    public int MedicalRecordId { get; init; }
}
public class NotificationTemplates
{
    public string AppTitle { get; init; } = "";
    public string AppContent { get; init; } = "";
    public string EmailTitle { get; init; } = "";
    public string EmailContent { get; init; } = "";
    public NotificationTemplates Build(NotificationType notificationType, NotificationTemplateContext ctx)
    {
        // Hematology 
        if (notificationType == NotificationType.HematologyInitial)
            return BuildHematologyIntitial(ctx);
        if (notificationType == NotificationType.HematologyReceived)
            return BuildHematologyReceived(ctx);
        if (notificationType == NotificationType.HematologyProcessing)
            return BuildHematologyProcessing(ctx);
        if (notificationType == NotificationType.HematologyCompleted)
            return BuildHematologyCompleted(ctx);

        // Xray 
        if (notificationType == NotificationType.XrayInitial)
            return BuildXrayIntitial(ctx);
        if (notificationType == NotificationType.XrayReceived)
            return BuildXrayReceived(ctx);
        if (notificationType == NotificationType.XrayProcessing)
            return BuildXrayProcessing(ctx);
        if (notificationType == NotificationType.XrayCompleted)
            return BuildXrayCompleted(ctx);

        return this;
    }

    #region Hematology
    private NotificationTemplates BuildHematologyIntitial(NotificationTemplateContext ctx)
    {
        var appTitle = "Yêu cầu xét nghiệm máu mới";
        var appContent = $"Có yêu cầu xét nghiệm máu mới cho bệnh án #{ctx.MedicalRecordId} (Mã phiếu: #{ctx.ResourceId}).";

        var url = GenerateHematologyLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[VLU_HMS] Thông báo yêu cầu xét nghiệm máu mới - Bệnh án #{ctx.MedicalRecordId}";
        var emailContent = $@"
            <h3>Yêu cầu xét nghiệm máu mới</h3>
            <p>Hệ thống ghi nhận một yêu cầu xét nghiệm máu mới với thông tin sau:</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu xét nghiệm:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái:</strong> Chờ tiếp nhận (Initial)</li>
            </ul>
            <p>Vui lòng truy cập hệ thống để xem chi tiết và thực hiện quy trình xét nghiệm.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý hồ sơ bệnh án</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }

    private NotificationTemplates BuildHematologyReceived(NotificationTemplateContext ctx)
    {
        var appTitle = "Xét nghiệm máu đã được tiếp nhận";
        var appContent = $"Phiếu xét nghiệm máu #{ctx.ResourceId} của bệnh án #{ctx.MedicalRecordId} đã được tiếp nhận.";

        var url = GenerateHematologyLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[HMS] Cập nhật trạng thái xét nghiệm máu - Phiếu #{ctx.ResourceId}";
        var emailContent = $@"
            <h3>Thông báo cập nhật trạng thái xét nghiệm</h3>
            <p>Phiếu xét nghiệm máu của bệnh nhân đã được khoa xét nghiệm tiếp nhận.</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu xét nghiệm:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái mới:</strong> Đã tiếp nhận (Received)</li>
            </ul>
            <p>Bạn có thể theo dõi tiến độ xét nghiệm tại đường dẫn dưới đây.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý Bệnh viện (HMS)</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }

    private NotificationTemplates BuildHematologyProcessing(NotificationTemplateContext ctx)
    {
        var appTitle = "Đang thực hiện xét nghiệm máu";
        var appContent = $"Phiếu xét nghiệm máu #{ctx.ResourceId} của bệnh án #{ctx.MedicalRecordId} đang trong quá trình thực hiện.";

        var url = GenerateHematologyLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[HMS] Cập nhật trạng thái xét nghiệm máu - Phiếu #{ctx.ResourceId}";
        var emailContent = $@"
            <h3>Thông báo cập nhật trạng thái xét nghiệm</h3>
            <p>Phiếu xét nghiệm máu đang trong quá trình xử lý và phân tích mẫu.</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu xét nghiệm:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái mới:</strong> Đang thực hiện (Processing)</li>
            </ul>
            <p>Vui lòng chờ kết quả chính thức từ khoa xét nghiệm.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý Bệnh viện (HMS)</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }

    private NotificationTemplates BuildHematologyCompleted(NotificationTemplateContext ctx)
    {
        var appTitle = "Kết quả xét nghiệm máu đã hoàn tất";
        var appContent = $"Phiếu xét nghiệm máu #{ctx.ResourceId} của bệnh án #{ctx.MedicalRecordId} đã có kết quả hoàn tất.";

        var url = GenerateHematologyLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[HMS] Kết quả xét nghiệm máu hoàn tất - Phiếu #{ctx.ResourceId}";
        var emailContent = $@"
            <h3>Thông báo kết quả xét nghiệm</h3>
            <p>Quy trình xét nghiệm máu đã hoàn tất. Kết quả đã có sẵn trên hệ thống.</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu xét nghiệm:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái mới:</strong> Đã hoàn tất (Completed)</li>
            </ul>
            <p>Vui lòng truy cập hệ thống để xem kết quả chi tiết và đưa ra chẩn đoán tiếp theo.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý Bệnh viện (HMS)</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }
    #endregion

    #region Xray
    private NotificationTemplates BuildXrayIntitial(NotificationTemplateContext ctx)
    {
        var appTitle = "Yêu cầu chụp X-Quang mới";
        var appContent = $"Có yêu cầu chụp X-Quang mới cho bệnh án #{ctx.MedicalRecordId} (Mã phiếu: #{ctx.ResourceId}).";

        var url = GenerateXrayLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[HMS] Thông báo yêu cầu chụp X-Quang mới - Bệnh án #{ctx.MedicalRecordId}";
        var emailContent = $@"
            <h3>Yêu cầu chụp X-Quang mới</h3>
            <p>Hệ thống ghi nhận một yêu cầu chụp X-Quang mới với thông tin sau:</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu X-Quang:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái:</strong> Chờ tiếp nhận (Initial)</li>
            </ul>
            <p>Vui lòng truy cập hệ thống để xem chi tiết và thực hiện quy trình chụp X-Quang.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý Bệnh viện (HMS)</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }

    private NotificationTemplates BuildXrayReceived(NotificationTemplateContext ctx)
    {
        var appTitle = "Yêu cầu X-Quang đã được tiếp nhận";
        var appContent = $"Phiếu X-Quang #{ctx.ResourceId} của bệnh án #{ctx.MedicalRecordId} đã được tiếp nhận.";

        var url = GenerateXrayLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[HMS] Cập nhật trạng thái X-Quang - Phiếu #{ctx.ResourceId}";
        var emailContent = $@"
            <h3>Thông báo cập nhật trạng thái X-Quang</h3>
            <p>Yêu cầu chụp X-Quang của bệnh nhân đã được khoa chẩn đoán hình ảnh tiếp nhận.</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu X-Quang:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái mới:</strong> Đã tiếp nhận (Received)</li>
            </ul>
            <p>Bạn có thể theo dõi tiến độ tại đường dẫn dưới đây.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý Bệnh viện (HMS)</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }

    private NotificationTemplates BuildXrayProcessing(NotificationTemplateContext ctx)
    {
        var appTitle = "Đang thực hiện chụp/đọc kết quả X-Quang";
        var appContent = $"Phiếu X-Quang #{ctx.ResourceId} của bệnh án #{ctx.MedicalRecordId} đang được thực hiện.";

        var url = GenerateXrayLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[HMS] Cập nhật trạng thái X-Quang - Phiếu #{ctx.ResourceId}";
        var emailContent = $@"
            <h3>Thông báo cập nhật trạng thái X-Quang</h3>
            <p>Yêu cầu X-Quang đang trong quá trình thực hiện chụp hoặc đọc kết quả chuyên khoa.</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu X-Quang:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái mới:</strong> Đang thực hiện (Processing)</li>
            </ul>
            <p>Vui lòng chờ kết quả chính thức từ khoa chẩn đoán hình ảnh.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý Bệnh viện (HMS)</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }

    private NotificationTemplates BuildXrayCompleted(NotificationTemplateContext ctx)
    {
        var appTitle = "Kết quả X-Quang đã hoàn tất";
        var appContent = $"Phiếu X-Quang #{ctx.ResourceId} của bệnh án #{ctx.MedicalRecordId} đã có kết quả hoàn tất.";

        var url = GenerateXrayLink(ctx.ResourceId, ctx.MedicalRecordId);
        var emailTitle = $"[HMS] Kết quả X-Quang hoàn tất - Phiếu #{ctx.ResourceId}";
        var emailContent = $@"
            <h3>Thông báo kết quả X-Quang</h3>
            <p>Quy trình chụp và chẩn đoán X-Quang đã hoàn tất. Kết quả đã có sẵn trên hệ thống.</p>
            <ul>
                <li><strong>Mã bệnh án:</strong> #{ctx.MedicalRecordId}</li>
                <li><strong>Mã phiếu X-Quang:</strong> #{ctx.ResourceId}</li>
                <li><strong>Trạng thái mới:</strong> Đã hoàn tất (Completed)</li>
            </ul>
            <p>Vui lòng truy cập hệ thống để xem phim chụp và kết quả chẩn đoán chi tiết.</p>
            <p><strong>Đường dẫn chi tiết:</strong> <a href='{url}'>{url}</a></p>
            <br/>
            <p>Trân trọng,</p>
            <p>Hệ thống Quản lý Bệnh viện (HMS)</p>";

        return Create(appTitle, appContent, emailTitle, emailContent);
    }
    #endregion

    #region Helper
    private string GenerateHematologyLink(int hematologyId, int medicalRecordId)
    {
        return $"api/medicalRecord/{medicalRecordId}/hematology/{hematologyId}";
    }

    private string GenerateXrayLink(int xrayId, int medicalRecordId)
    {
        return $"api/medicalRecord/{medicalRecordId}/xray/{xrayId}";
    }

    private NotificationTemplates Create(string appTitle, string appContent, string emailTitle, string emailContent)
    {
        return new NotificationTemplates
        {
            AppTitle = appTitle,
            AppContent = appContent,
            EmailTitle = emailTitle,
            EmailContent = emailContent
        };
    }
    #endregion
}