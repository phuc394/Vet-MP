import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartDatum, RevenueItem, TableResponse } from "./dashboardTypes";
import { chartColors, formatAxisLabel, formatCurrency, formatDate } from "./dashboardUtils";

type RevenueSectionProps = {
    revenueTrend: ChartDatum[];
    topServices: ChartDatum[];
    revenueItems: RevenueItem[];
    cancelledAppointments: TableResponse | null;
};

const RevenueSection = ({ revenueTrend, topServices, revenueItems, cancelledAppointments }: RevenueSectionProps) => {
    return (
        <section className="dashboard-section">
            <div className="section-title">
                <h2>Revenue</h2>
                <span>Revenue reports</span>
            </div>
            <div className="chart-grid revenue-grid">
                <article className="chart-panel chart-panel-wide">
                    <h3>Revenue Trend</h3>
                    <div className="chart-frame tall">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueTrend} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}K`} />
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                <Legend />
                                <Line type="monotone" dataKey="value" name="Revenue" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="chart-panel">
                    <h3>Top Revenue Services</h3>
                    <div className="chart-frame">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topServices} margin={{ top: 16, right: 12, bottom: 16, left: 8 }}>
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    height={72}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={formatAxisLabel}
                                    angle={-28}
                                    textAnchor="end"
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}K`} />
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => label} />
                                <Bar dataKey="value" name="Revenue" radius={[6, 6, 0, 0]}>
                                    {topServices.map((entry, index) => (
                                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>
            </div>

            <div className="table-grid">
                <article className="chart-panel">
                    <h3>Recent Revenue</h3>
                    <div className="data-table">
                        {revenueItems.slice(0, 6).map((item) => (
                            <div className="table-row" key={item.appointmentId}>
                                <span>#{item.appointmentId}</span>
                                <span>{formatDate(item.appointmentDate)}</span>
                                <strong>{formatCurrency(item.servicePrice)}</strong>
                            </div>
                        ))}
                        {revenueItems.length === 0 && <p className="empty-text">No revenue yet.</p>}
                    </div>
                </article>

                <article className="chart-panel">
                    <h3>Cancelled Appointments</h3>
                    <div className="data-table">
                        {(cancelledAppointments?.rows ?? []).slice(0, 6).map((row) => (
                            <div className="table-row" key={`${row[0]}`}>
                                <span>#{row[0]}</span>
                                <span>{formatDate(row[1])}</span>
                                <strong>{row[2] || "No reason provided"}</strong>
                            </div>
                        ))}
                        {cancelledAppointments?.rows.length === 0 && <p className="empty-text">No cancelled appointments.</p>}
                    </div>
                </article>
            </div>
        </section>
    );
};

export default RevenueSection;
