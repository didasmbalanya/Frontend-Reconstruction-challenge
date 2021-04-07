import { Layout, Row, Col, Drawer, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import RightMenu from './StaticMenu'
import useWindowDimensions from '../../hooks/windowSize'
import { useRouter } from 'next/router';

export function Header() {
    const [isScroll, setIsScroll] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(
        function mount() {
            function onScroll() {
                window.scrollY > 95 ? setIsScroll(true) : setIsScroll(false)
            }
            window.addEventListener('scroll', onScroll)
            window.addEventListener('load', onScroll)
            return function unMount() {
                window.removeEventListener('scroll', onScroll)
                window.removeEventListener('load', onScroll)
            }
        }
    )

    const windowDimensions = useWindowDimensions()
    const router = useRouter();
    const bgColor = router.pathname === '/' ? '#7450E5' : '#FFF8FA';

    return (
        <Layout.Header
            className={isScroll ? 'header-scroll' : null}
            style={{
                position: 'fixed',
                top: 0,
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
                    <Row align="middle">
                        <Col lg={6} md={12} sm={12} xs={16}>
                            <div className="logo">
                                <Link href="/">
                                    <a className="default-logo" aria-label="Reconstruction Web">
                                        <img src="/logo.svg" alt="Reconstruction Web" aria-hidden="true" />
                                    </a>
                                </Link>
                                <Link href="/">
                                    <a className="scrolled-logo" aria-label="Reconstruction Web">
                                        <img src="/scrolled-logo.svg" alt="Reconstruction Web" aria-hidden="true" />
                                    </a>
                                </Link>
                            </div>
                        </Col>
                        <Col
                            lg={18}
                            md={12}
                            sm={12}
                            xs={8}
                            className="menuWrapper"
                            style={{ display: 'none' }}
                        >
                            {windowDimensions.width > 991 ? (
                                <RightMenu mode="horizontal" />
                            ) : (
                                <>
                                    <Button
                                        className="barsMenu"
                                        type="default"
                                        onClick={() => setVisible(true)}
                                        aria-expanded="true"
                                    >
                                        <span />
                                        <span />
                                    </Button>
                                    <Drawer
                                        title="Menu"
                                        placement="right"
                                        closable
                                        onClose={() => setVisible(false)}
                                        visible={visible}
                                    >
                                        <RightMenu mode="inline" />
                                    </Drawer>
                                </>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </Layout.Header>
    );
}
