import ActiveLink from "@components/common/activeLink";
import { DropDownArrow } from "@components/icons/drop-down-arrow";
import { Menu } from "antd";

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

import { ENABLED_FEATURES } from "../../lib/helpers";

const { SubMenu } = Menu;

export interface Props {
    mode: any;
    courseType?: string;
    isScroll?: boolean;
}

export default function RightMenu({ mode, courseType }: Props) {
    const [visible, showModal] = useState(false);
    const [showSignup, setShowSignup] = useState<boolean | undefined>(false);
    const [visible123, showModal123] = useState(false);

    const [visibleSelectStudents, showModalSelectStudents] = useState(false);

    const router = useRouter();
    const [isScroll, setIsScroll] = useState(false);

    const immersiveMenuItem = !isScroll && courseType === 'immersive' && 'immersive-menu-item';
    const immersiveSubMenu = !isScroll && courseType === 'immersive' && 'immersive-sub-menu';
    const immersiveMenuButton = courseType === 'immersive' && 'immersive-menu-button';

    function handleClick12() {
        showModal123(true);
    }

    function handleSelectStudentsClick() {
        showModalSelectStudents(true);
    }

    function handleClick1() {
        setShowSignup(true);
    }
    const onStudentSelected = useCallback(
        async (student: any) => {
            await router.push(`/account/schedule?profile_id=${student.id}`);
            return;
        },
        [router],
    );

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

    return (
        <>
            <Menu
                mode={mode}
                className="header-menu"
                style={{
                    background: 'inherit',
                }}
            >
                <Menu.Item>
                    <ActiveLink
                        children={`How It Works`}
                        href="/how-it-works"
                        className={mode === 'horizontal' && immersiveMenuItem}
                    />
                </Menu.Item>
                <Menu.Item>
                    <ActiveLink
                        children={`Courses`}
                        href="/courses"
                        className={mode === 'horizontal' && immersiveMenuItem}
                    />
                </Menu.Item>
                <SubMenu
                    title="Curriculum"
                    className={mode === 'horizontal' && immersiveSubMenu}
                    icon={<DropDownArrow />}
                >
                    <Menu.Item>
                        <ActiveLink children={`Shorties`} href="/curriculum/shorties" className={null} />
                    </Menu.Item>
                    <Menu.Item>
                        <ActiveLink children={`Youngins`} href="/curriculum/youngins" className={null} />
                    </Menu.Item>
                    <Menu.Item>
                        <ActiveLink children={`Gen Z`} href="/curriculum/genz" className={null} />
                    </Menu.Item>
                    <Menu.Item>
                        <ActiveLink children={`Grown Folks`} href="/curriculum/grownfolks" className={null} />
                    </Menu.Item>
                </SubMenu>

                <SubMenu
                    title="About Us"
                    icon={<DropDownArrow />}
                    className={mode === 'horizontal' && immersiveSubMenu}
                >
                    <Menu.Item>
                        <ActiveLink children={`About Us`} href="/about" className={null} />
                    </Menu.Item>
                    <Menu.Item>
                        <ActiveLink children={`Work With Us`} href="/work-with-us" className={null} />
                    </Menu.Item>
                    <Menu.Item>
                        <ActiveLink children={`Partner With Us`} href="/partner-with-us" className={null} />
                    </Menu.Item>
                </SubMenu>
                <Menu.Item>
                    <Link href="//store.reconstruction.us/" passHref={true}>
                        <a className={mode === 'horizontal' && immersiveMenuItem} target="_blank">
                            Store
                        </a>
                    </Link>
                </Menu.Item>

                <Menu.Item>
                    <a
                        className={immersiveMenuItem}
                        onClick={(e) => {
                            e.preventDefault();
                            showModal(true);
                        }}
                    >
                        Login
                    </a>
                </Menu.Item>

                {ENABLED_FEATURES.SIGN_UP && (
                    <Menu.Item>
                        <button
                            onClick={handleClick1}
                            className={`button-secondary-nav ${mode === 'horizontal' && immersiveMenuButton}`}
                        >
                            Sign Up
                        </button>
                    </Menu.Item>
                )}
            </Menu>
        </>
    );
}
