import { Col, Layout, Row } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useWindowDimensions from "../../hooks/windowSize";
import RightMenu from "./Menu";


export interface Props {
    courseType?: string;
}

export function Header({ courseType }: Props) {
    const [isScroll, setIsScroll] = useState(false);
    const [checked, setChecked] = useState(false);
    const [verticalStyle, setVerticalStyle] = useState(false);
    const immersiveMenu = isScroll === false && courseType === 'immersive' && 'immersive-menu';

    useEffect(function mount() {
        function onScroll() {
            // 95 is header height
            window.scrollY > 95 ? setIsScroll(true) : setIsScroll(false);
        }
        window.addEventListener('scroll', onScroll);
        window.addEventListener('load', onScroll);
        return function unMount() {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('load', onScroll);
        };
    });

    const windowDimensions = useWindowDimensions();
    const router = useRouter();
    let bgColor = '#FFF8FA';

    if (router.pathname === '/') bgColor = '#894EFF';
    if (isScroll) bgColor = '#FFF';

    function handleCheck() {
        setVerticalStyle(!verticalStyle);
        document.getElementById('nav__wrapper').classList.toggle('nav-checked');
        if (!checked) {
            document.getElementById('nav__wrapper').classList.add('nav-checked-bg');
        } else {
            setTimeout(function () {
                document.getElementById('nav__wrapper').classList.remove('nav-checked-bg');
            }, 270);
        }
        setChecked(!checked);
    }

    return (
        <Layout.Header
            className={isScroll ? 'header-scroll' : null}
            style={{
                position: 'fixed',
                top: '50px',
                zIndex: 99,
                width: '100%',
                background: bgColor,
                padding: '18px 0',
                lineHeight: '54px',
                height: 95,
                transition: 'all ease-in-out .4s',
            }}
            id="header"
        >
            <div className="header">
                <div className="container">
                    <Row>
                        <Col lg={6} md={12} sm={12} xs={16}>
                            <div
                                className="logo"
                                style={{
                                    display: `${
                                        verticalStyle === true && windowDimensions.width < 991 ? 'none' : 'block'
                                    }`,
                                }}
                            >
                                <Link href="/">
                                    <a className="default-logo" aria-label="Reconstruction">
                                        <img src="/logo.svg" alt="Reconstruction" />
                                    </a>
                                </Link>
                                <Link href="/">
                                    <a className="scrolled-logo" aria-label="Reconstruction">
                                        <img
                                            src={`/${
                                                !isScroll && courseType === 'immersive'
                                                    ? 'scrolled-immersive-logo.svg'
                                                    : 'scrolled-logo.svg'
                                            }`}
                                            alt="Reconstruction"
                                        />
                                    </a>
                                </Link>
                            </div>
                        </Col>
                        {windowDimensions.width && (
                            <Col lg={18} md={12} sm={12} xs={8} className="menuWrapper" style={{ display: 'none' }}>
                                {windowDimensions.width > 991 ? (
                                    <RightMenu mode="horizontal" courseType={courseType} isScroll={isScroll} />
                                ) : (
                                    <div className="nav-wrapper" id="nav__wrapper">
                                        <input
                                            type="checkbox"
                                            className="nav__checkbox"
                                            id="nav-toggle"
                                            onChange={handleCheck}
                                        />
                                        <label
                                            htmlFor="nav-toggle"
                                            className={`nav__button ${
                                                verticalStyle === true &&
                                                windowDimensions.width < 991 &&
                                                'vertical-style'
                                            } `}
                                        >
                                            <span className={`nav__icon ${immersiveMenu}`}></span>
                                        </label>
                                        <div className="nav__background">
                                            <nav className="nav__menu">
                                                <Col lg={6} md={12} sm={12} xs={16}>
                                                    <div
                                                        className="logo"
                                                        style={{
                                                            height: 95,
                                                            lineHeight: '54px',
                                                            padding: '18px 0',
                                                        }}
                                                    >
                                                        <Link href="/">
                                                            <a aria-label="Reconstruction">
                                                                <img src="/logo.svg" alt="Reconstruction" />
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </Col>
                                                <RightMenu mode="inline" courseType={courseType} isScroll={isScroll} />
                                            </nav>
                                        </div>
                                    </div>
                                )}
                            </Col>
                        )}
                    </Row>
                </div>
            </div>
        </Layout.Header>
    );
}
