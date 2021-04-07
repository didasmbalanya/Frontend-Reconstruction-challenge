import { Col, Row, Typography } from "antd";

import Link from "next/link";

const { Title } = Typography;

export default function Hero() {
    return (
        <div className="hero__wrapper">
            <div className="container">
                <div className="hero__wrapper__content center">
                    <Row>
                        <Col span={24}>
                            <Title level={1}>Unapologetically Black Education</Title>
                            <p>Personal, world-class education at home for $10 per session</p>
                            <Link href="/courses">
                                <button className="hero___cta button-primary-l" style={{ width: '284px' }}>
                                    Find a Class
                                    <span className="hero__cta__arrow"></span>
                                </button>
                            </Link>
                        </Col>
                    </Row>
                </div>
                <div className="hero__image__outer__bg">
                    <picture>
                        <source media="(max-width: 574px)" srcSet="/hero-bg-mobile-new.png" />
                        <source media="(min-width: 575px)" srcSet="/hero-bg-new.png" />
                        <img alt="Unapologetically Black Education" src="/hero-bg-new.png" />
                    </picture>
                </div>
                <div className="hero__image__wrapper">
                    <picture>
                        <source media="(max-width: 574px)" srcSet="/hero-image-mobile-new2.png" />
                        <source media="(min-width: 575px)" srcSet="/hero-image-new.png" />
                        <img alt="Unapologetically Black Education" src="/hero-image-new.png" />
                    </picture>
                </div>
            </div>
        </div>
    );
}
