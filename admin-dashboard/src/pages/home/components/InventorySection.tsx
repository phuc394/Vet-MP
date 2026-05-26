import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartDatum, TableResponse } from "./dashboardTypes";
import { chartColors, formatAxisLabel } from "./dashboardUtils";

type InventorySectionProps = {
    medicineStock: ChartDatum[];
    lowStock: TableResponse | null;
};

const InventorySection = ({ medicineStock, lowStock }: InventorySectionProps) => {
    return (
        <section className="dashboard-section">
            <div className="section-title">
                <h2>Tồn kho</h2>
                <span>Inventory reports</span>
            </div>
            <div className="chart-grid inventory-grid">
                <article className="chart-panel chart-panel-wide">
                    <h3>Tồn kho thuốc</h3>
                    <div className="chart-frame">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={medicineStock} margin={{ top: 16, right: 24, bottom: 16, left: 8 }}>
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
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip labelFormatter={(label) => label} />
                                <Bar dataKey="value" name="Tồn kho" radius={[6, 6, 0, 0]}>
                                    {medicineStock.map((entry, index) => (
                                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="chart-panel">
                    <h3>Thuốc dưới ngưỡng</h3>
                    <div className="low-stock-list">
                        {(lowStock?.rows ?? []).slice(0, 6).map((row) => (
                            <div className="low-stock-row" key={`${row[0]}`}>
                                <span>{row[0]}</span>
                                <strong>{row[1]} / {row[2]}</strong>
                            </div>
                        ))}
                        {lowStock?.rows.length === 0 && <p className="empty-text">Không có thuốc dưới ngưỡng.</p>}
                    </div>
                </article>
            </div>
        </section>
    );
};

export default InventorySection;
