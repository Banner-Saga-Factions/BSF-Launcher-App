import styled from "styled-components";
import { mixins } from "@/styles/mixins";

export const TitleText = styled.h1`
    font-size: 64px;
    font-weight: 900;
    -webkit-text-stroke: 2px #ffdbb1;
    -webkit-font-smoothing: antialiased;
    color: #010101;
`;

export const ButtonText = styled.h2`
    padding: 15%;
    margin: 0 50% 7% 50%;
    text-shadow: 0px 0px 15px ${(props) => props.theme.colors.blue};
    color: ${(props) => props.theme.colors.lightBlue};
    ${mixins.buttonText}
`;
