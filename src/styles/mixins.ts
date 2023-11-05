import { css } from "styled-components";

export const mixins = {
    flexCenter: css`
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    loadingSpin: css`
        @keyframes loading {
            0% {
                rotate: 0deg;
            }
            100% {
                rotate: 360deg;
            }
        }
    `,
    buttonText: css`
        user-select: none;
        position: relative;
    `,

    interactable: css`
        transition: transform 0.3s;
        &:hover {
            transform: scale(1.05);
            cursor: pointer;
        }
    `,

    engulf: css`
        position: absolute;
        width: 100vw;
        height: 100vh;
    `,
};
