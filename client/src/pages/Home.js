import React from "react";
import tw from "twin.macro"; //eslint-disable-line
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";


import MainFeature from "components/features/TwoColSingleFeatureWithStats2.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import Navbar from "components/layout/Navbar";


export default () => (
    <div>
        <Navbar/>
    
  <AnimationRevealPage>
    <MainFeature />
    
    <Footer />
  </AnimationRevealPage>
  </div>
);
