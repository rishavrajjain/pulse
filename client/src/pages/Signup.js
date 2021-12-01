import React, { useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container as ContainerBase } from "components/misc/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import Navbar from "components/layout/Navbar";


const Container = tw(ContainerBase)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;

const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;




const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;



export default function Signup(props){

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);

  const onSubmit = async(e)=>{
    e.preventDefault();
    if(email === '' || password ===''){
      toast.error('Please fill in all the fields', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
      return;
    }
    setLoading(true);
    try{
      const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/createuser`,{
        email,
        password
      })
      localStorage.setItem('app-token',result.data.data.token);
      localStorage.setItem('email',result.data.data.email);
      toast.success('Signed in successfully', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
        props.history.push('/dashboard')
        setLoading(false);
    }catch(err){
      console.log(err);
      toast.error('Something went wrong, please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
        setLoading(false);
      return;
    }


  }


 
  const  illustrationImageSrc = illustration
  const headingText = "Sign Up For Pulse"
  
  const submitButtonText = "Sign Up"
  const SubmitButtonIcon = SignUpIcon

  return(
    <div><Navbar/>
    <AnimationRevealPage>
    <Container>
      <Content>
        <MainContainer>
          
          <MainContent>
            <Heading>{headingText}</Heading>
            <FormContainer>
              
              
              <Form>
                <Input type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
                <Input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
                <SubmitButton type="submit" onClick={onSubmit}>
                  <SubmitButtonIcon className="icon" />
                  <span className="text">{submitButtonText}</span>
                </SubmitButton>
                

                <p tw="mt-8 text-sm text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link to="/login" tw="border-b border-gray-500 border-dotted">
                    Sign In
                  </Link>
                </p>
              </Form>
            </FormContainer>
          </MainContent>
        </MainContainer>
        <IllustrationContainer>
          <IllustrationImage imageSrc={illustrationImageSrc} />
        </IllustrationContainer>
      </Content>
    </Container>
  </AnimationRevealPage>
  </div>
  )
}

