import { RevenueSummary } from "./dashboardTypes";
import { formatCurrency, formatNumber } from "./dashboardUtils";

type MetricGridProps = {
    revenueSummary: RevenueSummary | null;
    cancelledCount: number;
};

const MetricGrid = ({ revenueSummary, cancelledCount }: MetricGridProps) => {
    return (
        <section className="metric-grid" aria-label="Revenue summary">
            <article className="metric-card">
                <span className="metric-label">Tổng doanh thu</span>
                <strong>{formatCurrency(revenueSummary?.totalRevenue ?? 0)}</strong>
                <small>Doanh thu từ lịch hẹn hoàn tất</small>
            </article>
            <article className="metric-card">
                <span className="metric-label">Lịch hẹn hoàn tất</span>
                <strong>{formatNumber(revenueSummary?.appointmentCount ?? 0)}</strong>
                <small>Số đơn có trạng thái completed</small>
            </article>
            <article className="metric-card">
                <span className="metric-label">Doanh thu trung bình</span>
                <strong>{formatCurrency(revenueSummary?.averageRevenue ?? 0)}</strong>
                <small>Giá trị trung bình mỗi lịch hẹn</small>
            </article>
            <article className="metric-card">
                <span className="metric-label">Lịch hẹn đã hủy</span>
                <strong>{formatNumber(cancelledCount)}</strong>
                <small>Có ghi nhận lý do hủy</small>
            </article>
        </section>
    );
};

export default MetricGrid;
