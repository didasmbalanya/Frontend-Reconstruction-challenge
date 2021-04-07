/* eslint-disable max-len */
import Icon from '@ant-design/icons';

export function DropDownArrow(props) {
    const DropDown = () => (
        <svg width="16" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.0947 0.881456C15.4129 1.16784 15.4129 1.63216 15.0947 1.91855L8.57618 7.78521C8.25798 8.0716 7.74206 8.0716 7.42386 7.78521L0.90534 1.91855C0.587135 1.63216 0.587135 1.16784 0.90534 0.881457C1.0646 0.738124 1.27338 0.666528 1.48211 0.666668L14.5197 0.666668C14.7278 0.66693 14.9359 0.738526 15.0947 0.881456Z"
                fill="#FFF8FA"
            />
        </svg>
    );

    return <Icon {...props} component={DropDown} />;
}