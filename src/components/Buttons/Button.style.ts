import { styled } from "styled-components";
import { mixins } from "@/styles";

export const TextButtonText = styled.h2`
    ${mixins.buttonText}
    padding: 15%;
    margin: unset;
    text-shadow: 0px 0px 15px ${(props) => props.theme.colors.blue};
    color: ${(props) => props.theme.colors.lightBlue};
`;

export const BannerButtonText = styled.h2`
    ${mixins.buttonText}
    fontSize: "64px",
    color: theme.colors.beige,
    textShadow: "0px 0px 15px black",
    bottom: "20px",
`;
