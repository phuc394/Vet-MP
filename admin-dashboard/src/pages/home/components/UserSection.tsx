import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartDatum } from "./dashboardTypes";
import { chartColors, formatNumber, getAppointmentStatusColor } from "./dashboardUtils";

type UserSectionProps = {
    userRoles: ChartDatum[];
    petSpecies: ChartDatum[];
    appointmentStatus: ChartDatum[];
    totalUsers: number;
    staffCount: number;
    customerCount: number;
};

const UserSection = ({
    userRoles,
    petSpecies,
    appointmentStatus,
    totalUsers,
    staffCount,
    customerCount,
}: UserSectionProps) => {
    return (
        <section className="dashboard-section">
            <div className="section-title">
                <h2>Users and Staff</h2>
                <span>User reports</span>
            </div>
            <div className="user-grid">
                <article className="chart-panel">
                    <h3>Role Distribution</h3>
                    <div className="chart-frame">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={userRoles} dataKey="value" nameKey="name" innerRadius={64} outerRadius={104} paddingAngle={4}>
                                    {userRoles.map((entry, index) => (
                                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <div className="role-summary">
                    <article className="metric-card">
                        <span className="metric-label">Total Users</span>
                        <strong>{formatNumber(totalUsers)}</strong>
                        <small>All roles in the system</small>
                    </article>
                    <article className="metric-card">
                        <span className="metric-label">Staff</span>
                        <strong>{formatNumber(staffCount)}</strong>
                        <small>Includes admin and staff</small>
                    </article>
                    <article className="metric-card">
                        <span className="metric-label">Customers</span>
                        <strong>{formatNumber(customerCount)}</strong>
                        <small>Role customer</small>
                    </article>
                </div>
            </div>

            <div className="chart-grid operation-grid">
                <article className="chart-panel">
                    <h3>Pet Species</h3>
                    <div className="chart-frame">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={petSpecies} dataKey="value" nameKey="name" outerRadius={108}>
                                    {petSpecies.map((entry, index) => (
                                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </article>

                <article className="chart-panel">
                    <h3>Appointment Status</h3>
                    <div className="chart-frame">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={appointmentStatus} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" name="Appointment Count" radius={[6, 6, 0, 0]}>
                                    {appointmentStatus.map((entry) => (
                                        <Cell key={entry.name} fill={getAppointmentStatusColor(entry.name)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default UserSection;
