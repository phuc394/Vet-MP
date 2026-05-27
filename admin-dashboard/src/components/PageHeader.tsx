type PageHeaderProps = {
    title: string;
    kicker?: string;
    description?: string;
};

const PageHeader = ({
    title,
    kicker = "Report overview",
    description = "Cập nhật theo dữ liệu hiện tại",
}: PageHeaderProps) => {
    return (
        <header className="page-header">
            <div>
                <p className="page-header-kicker">{kicker}</p>
                <h1>{title}</h1>
            </div>
            <div className="page-header-description">{description}</div>
        </header>
    );
};

export default PageHeader;
