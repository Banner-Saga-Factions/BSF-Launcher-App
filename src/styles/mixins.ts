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
    `
};