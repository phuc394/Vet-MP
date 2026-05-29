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
                <span className="metric-label">Total Revenue</span>
                <strong>{formatCurrency(revenueSummary?.totalRevenue ?? 0)}</strong>
                <small>Revenue from completed appointments</small>
            </article>
            <article className="metric-card">
                <span className="metric-label">Completed Appointments</span>
                <strong>{formatNumber(revenueSummary?.appointmentCount ?? 0)}</strong>
                <small>Appointments with completed status</small>
            </article>
            <article className="metric-card">
                <span className="metric-label">Average Revenue</span>
                <strong>{formatCurrency(revenueSummary?.averageRevenue ?? 0)}</strong>
                <small>Average value per appointment</small>
            </article>
            <article className="metric-card">
                <span className="metric-label">Cancelled Appointments</span>
                <strong>{formatNumber(cancelledCount)}</strong>
                <small>Appointments with cancellation reasons</small>
            </article>
        </section>
    );
};

export default MetricGrid;
