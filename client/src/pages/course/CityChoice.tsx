import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    label: '강릉',
    imgPath: require('../../assets/image/강릉시.jpg'),
  },
  {
    label: '속초',
    imgPath: require('../../assets/image/속초시.jpg'),
  },
  {
    label: '평창',
    imgPath: require('../../assets/image/평창시.jpg'),
  },
  {
    label: '동해',
    imgPath: require('../../assets/image/동해시.jpg'),
  },
];

const CityChoice = () => {
  const themes = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{images[activeStep].label}</Typography>
      </Paper>
      <AutoPlaySwipeableViews
        axis={themes.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Box
                component="img"
                sx={{
                  height: 450,
                  display: 'block',
                  maxWidth: 400,
                  overflow: 'hidden',
                  width: '100%',
                }}
                src={step.imgPath}
                alt={step.label}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
            Next
            {themes.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {themes.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default CityChoice;
// const CityChoice = () => {
//   const theme = useTheme();
//   const [activeStep, setActiveStep] = React.useState(0);

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const images = [
//     {
//       label: '강릉',
//       imgPath: 'image/강릉시1.jpg',
//     },
//     {
//       label: '속초',
//       imgPath: 'image/속초시.jpg',
//     },
//     {
//       label: '평창',
//       imgPath: 'image/강릉시1.jpg',
//     },
//     {
//       label: '동해',
//       imgPath: 'image/강릉시1.jpg',
//     },
//   ];

//   const MyMobileStepper = styled(MobileStepper)`
//     max-width: 400px;
//     flex-grow: 1px;
//   `;
//   return (
//     <StyledEngineProvider>
//       <MyMobileStepper
//         variant="progress"
//         steps={6}
//         position="static"
//         activeStep={activeStep}
//         nextButton={
//           <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
//             Next
//             {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
//           </Button>
//         }
//         backButton={
//           <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
//             {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
//             Back
//           </Button>
//         }
//       />
//     </StyledEngineProvider>
//   );
// };

// export default CityChoice;

// import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import MobileStepper from '@mui/material/MobileStepper';
// import Paper from '@mui/material/Paper';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// import SwipeableViews from 'react-swipeable-views';
// import { autoPlay } from 'react-swipeable-views-utils';
// import Chip from '@mui/material/Chip';

// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// const images = [
//   {
//     label: '강릉',
//     imgPath: 'img/강릉시1.jpg',
//   },
//   {
//     label: '속초',
//     imgPath: 'img/속초시.jpg',
//   },
//   {
//     label: '평창',
//     imgPath: 'img/강릉시1.jpg',
//   },
//   {
//     label: '동해',
//     imgPath: 'img/강릉시1.jpg',
//   },
// ];

// const CityChoice = () => {
//   const theme = useTheme();
//   const [activeStep, setActiveStep] = React.useState(0);
//   const maxSteps = images.length;

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleStepChange = (step: any) => {
//     setActiveStep(step);
//   };

//   //   const chipStyle = styled.Chip``

//   return (
//     <Box
//       sx={{
//         maxWidth: 400,
//         flexGrow: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//       }}
//     >
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <div style={{ position: 'relative', zIndex: 2 }}>
//           <Chip
//             label={images[activeStep].label}
//             variant="outlined"
//             sx={{
//               width: 140,
//               height: 60,
//               border: 5,
//               borderRadius: 30,
//               borderColor: '#566CF0',
//               fontSize: 24,
//               color: '#566CF0',
//               margin: 3,
//               padding: 2,
//             }}
//           />
//         </div>
//         <div
//           style={{
//             position: 'relative',
//             zIndex: 1,
//             paddingBottom: 50,
//             width: 500,
//             height: 100,
//             borderTop: '5px solid #566CF0',
//           }}
//         ></div>
//       </div>

//       <AutoPlaySwipeableViews
//         axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
//         index={activeStep}
//         onChangeIndex={handleStepChange}
//         enableMouseEvents
//       >
//         {images.map((step, index) => (
//           <div key={step.label}>
//             {Math.abs(activeStep - index) <= 2 ? (
//               <Box
//                 component="img"
//                 sx={{
//                   height: 450,
//                   display: 'block',
//                   maxWidth: 350,
//                   overflow: 'hidden',
//                   width: '100%',
//                   margin: '0 auto',
//                   borderRadius: 10,
//                 }}
//                 src={step.imgPath}
//                 alt={step.label}
//               />
//             ) : null}
//           </div>
//         ))}
//       </AutoPlaySwipeableViews>
//       <MobileStepper
//         steps={maxSteps}
//         position="static"
//         activeStep={activeStep}
//         nextButton={
//           <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
//             Next
//             {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
//           </Button>
//         }
//         backButton={
//           <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
//             {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
//             Back
//           </Button>
//         }
//       />
//     </Box>
//   );
// };

// export default CityChoice;
