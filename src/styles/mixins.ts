import { css } from "styled-components";

export const mixins = {
    flexCenter: css`
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    loadingSpin: css`
        @keyframes loading-spin {
            0% {
                rotate: 0deg;
            }
            100% {
                rotate: 360deg;
            }
        }
    `,

    interactable: css`
        transition: transform 0.3s;
        &:hover {
            cursor: pointer;
        }
    `,

    engulf: css`
        position: absolute;
        width: 100vw;
        height: 100vh;
    `,

    titleText: css`
        font-size: ${(props) => props.theme.fontSizes.title};
        font-weight: 900;
    `,

    buttonText: css`
        font-size: ${(props) => props.theme.fontSizes.button};
        user-select: none;
        position: relative;
    `,
};
