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
    margin: unset;
    text-shadow: 0px 0px 15px ${(props) => props.theme.colors.blue};
    color: ${(props) => props.theme.colors.lightBlue};
    ${mixins.buttonText}
`;

export const ModalTitle = styled.h1`
    text-align: center;
    max-width: 40vmin;
    font-size: 64px;
    font-weight: 900;
    color: ${(props) => props.theme.colors.beige};
`;
