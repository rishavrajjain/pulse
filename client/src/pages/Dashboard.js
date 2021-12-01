import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import StatsIllustrationSrc from "images/stats-illustration.svg";
import { ReactComponent as SvgDotPattern } from "images/dot-pattern.svg";
import axios, { Axios } from "axios";
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay';
import BarChart from 'react-bar-chart';
import Navbar from "components/layout/Navbar";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto relative`;
const TextColumn = styled(Column)(props => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;



const PrimaryButton = tw(PrimaryButtonBase)`mt-8 md:mt-10 text-sm inline-block mx-auto md:mx-0`;

const DecoratorBlob = styled(SvgDotPattern)(props => [
  tw`w-20 h-20 absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 fill-current text-primary-500 -z-10`
])

export default function Dashboard() {
    const subheading = "Pulse"
    const heading = "Powered by Modzy"
  const description = "Complete analysis of audio conversations.Best tool for analysis of customer support calls for insights,sentiments, ranking, prioritizing accordingly.Taking customer service to the next level with Pulse."
  const primaryButtonText = "Upload Audio"
  const primaryButtonUrl = "https://timerse.com"
  const imageSrc = StatsIllustrationSrc
  const imageCss = null
  const imageContainerCss = null
  const imageDecoratorBlob = false
  const imageDecoratorBlobCss = null
  const imageInsideDiv = true
  const textOnLeft = false

  const [dataFile,setDataFile]=useState(null);
  const [text,setText]=useState('');
  const [loading,setLoading]=useState(false);

  const [sentimentData,setSentimentData] = useState([]);
  const [topics,setTopics]=useState([]);
  const [summary,setSummary]=useState('');
  const [showData,setShowData]=useState(false);

  const margin = {top: 20, right: 20, bottom: 30, left: 40};

 

  const analyse = (event)=>{

    const data = new FormData() ;
    data.append('file', event.target.files[0]);
    setLoading(true);
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/analyse`, data)
        .then(result => { 
          axios.post(`${process.env.REACT_APP_API_BASE_URL}/analyseData`, {
            data:result.data.data
          }).then((res)=>{
            const sentiments =[];
          res.data.data.sentiment.results['0001']["results.json"].data.result.classPredictions.map((data)=>{
            const sent ={
              text:data.class,
              value:data.score
            }
            sentiments.push(sent);
            if(sentiments.length ===3){
              setSentimentData(sentiments);
            }
          })

          setSummary(res.data.data.summary.results['0001']["results.json"].summary)
          setTopics(res.data.data.topicModels.results['0001']["results.json"])
          setShowData(true);
          })
          
          setLoading(false);
    })
        .catch((err)=>{
          setLoading(false);
          console.log(err);
          toast.error('Something went wrong', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        })

    
  }

  

  return(
    <LoadingOverlay
  active={loading}
  spinner
  text='Analysing your content...'
  >
  <Navbar/>
    <Container>
    <TwoColumn css={!imageInsideDiv && tw`md:items-center`}>
      <ImageColumn css={imageContainerCss}>
        {imageInsideDiv ? <Image imageSrc={imageSrc} css={imageCss} /> : <img src={imageSrc} css={imageCss} alt="" />}
        {imageDecoratorBlob && <DecoratorBlob css={imageDecoratorBlobCss} />}
      </ImageColumn>
      <TextColumn textOnLeft={textOnLeft}>
        <TextContent>
          {subheading && <Subheading>{subheading}</Subheading>}
          
          <Description>{description}</Description>
          <Heading>{heading}</Heading>
          <br></br>
          <div class="custom-file">
  <input type="file" class="custom-file-input" id="customFile" onChange={analyse}/>
  <label class="custom-file-label" for="customFile">Choose file</label>
</div>
          
          
        </TextContent>
      </TextColumn>
    </TwoColumn>
    <br></br>
    {
      showData?(
        <div className="container">
          
          <br></br>
          <div className="row">
            <div className="col-xl-6 col-lg-6">
            <h6>Topics</h6>
              {
                topics.map((topic)=>{
                  return(
                    <h3 className="badge badge-success" style={{marginRight:'0.5rem'}}><i className="fa fa-tags"></i>{topic}</h3>
                  )
                })
              }
            
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="card" style={{padding:'1rem'}}>
              <h2 className="card-title">Summary</h2>
                <p className="card-text">{summary}</p>
              </div>
            
            </div>
          
          </div>

          <br></br>
          <div className="row">
          <div className="col-xl-12 col-lg-12">
          <div style={{width: '100%'}}> 
          <BarChart ylabel='Score'
            width={500}
            height={500}
            margin={margin}
            data={sentimentData}
          
            />
      </div>
      </div>
          </div>
        
        
        </div>
        
      ):(
        <div></div>
      )
    }
  </Container>
  </LoadingOverlay>
  )
}

