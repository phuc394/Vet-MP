import PageHeader from "./PageHeader";

type HeaderProps = {
    title: string;
    kicker?: string;
    description?: string;
};

const Header = ({ title, kicker, description }: HeaderProps) => {
    return <PageHeader title={title} kicker={kicker} description={description} />;
};

export default Header;
