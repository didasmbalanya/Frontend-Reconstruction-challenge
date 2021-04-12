import React from 'react';
import Link from 'next/link';

// TODO - make component responive
export const CourseCard = ({ courseType, title, level, text }) => {
    return (
        <div
            style={{
                minHeight: '367px',
                borderRadius: '16px',
                height: '100%',
                width: '100%',
                padding: '15px',
                margin: '20px',
                border: '1px solid #3F0D28',
                boxSizing: 'border-box',
                position: 'relative',
            }}
        >
            {/* Top half */}
            <div
                style={{
                    position: 'absolute',
                    height: '168px',
                    left: '0.5px',
                    right: '-0,33px',
                    top: '0px',
                }}
            >
                {/* Text */}
                <div style={{ width: '318.5px', height: '118px', left: '24px', top: '24px' }}>
                    {/* Reading */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '53px',
                            height: '14px',
                            left: '24px',
                            top: '24px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: '12px',
                            lineHeight: '120%',
                            color: '#894EFF',
                            textTransform: 'uppercase',
                        }}
                    >
                        {courseType}
                    </div>

                    {/*  Course Title */}
                    <div
                        style={{
                            color: '#3F0D28',
                            position: 'absolute',
                            minHeight: '58px',
                            left: '24px',
                            right: '24px',
                            top: '42px',
                            fontFamily: 'Avenir',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '24px',
                            lineHeight: '120%',
                            paddingBottom: '20px',
                        }}
                    >
                        {title}
                    </div>

                    {/* Course Level */}
                    <div
                        style={{
                            position: 'absolute',
                            height: '26px',
                            left: '24px',
                            bottom: '20px',

                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '160%',

                            color: '#3F0D28',
                        }}
                    >
                        {level}
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            position: 'absolute',
                            height: '2px',
                            left: '0px',
                            right: '0.5px',
                            bottom: '0px',
                            background: '#3F0D28',
                        }}
                    ></div>

                    {/* intro text */}
                    <div
                        style={{
                            position: 'absolute',
                            height: '78px',
                            left: '24px',
                            right: '23.67px',
                            top: '192px',
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '160%',
                            color: '#3F0D28',
                            // overflow: text.length > 120 ? 'hidden' : 'unset',
                            // textOverflow: text.length > 120 ?'ellipsis': 'unset',
                        }}
                    >
                        {text}
                    </div>
                </div>
            </div>

            {/* learn more button */}
            <Link href="/">
                <a aria-label="learn-more button">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '16px 24px',
                            position: 'absolute',
                            height: '50px',
                            left: '24px',
                            right: '23.67px',
                            bottom: '10px',
                            background: '#3F0D28',
                            borderRadius: '12px',
                        }}
                    >
                        <div
                            style={{
                                position: 'static',
                                width: '271px',
                                height: '24px',
                                left: '24px',
                                top: '16px',
                                flex: 'none',
                                order: 0,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                                margin: '0px 0px',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    textTransform: 'capitalize',
                                    width: '105px',
                                    height: '24px',
                                    left: 'calc(50% - 105px/2 + 1px)',
                                    top: 'calc(50% - 24px/2)',
                                    fontFamily: 'Avenir',
                                    fontStyle: 'normal',
                                    fontWeight: 500,
                                    fontSize: '20px',
                                    lineHeight: '120%',
                                    textAlign: 'center',
                                    color: '#FFF8FA',
                                }}
                            >
                                learn more
                                {/* arrow */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '100%',
                                        right: '-100%',
                                        top: '5.33%',
                                        bottom: '-29.17%',
                                    }}
                                >
                                    <img src="/button-arrow.svg" alt="Reconstruction" />
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>

            {/* close */}
        </div>
    );
};
