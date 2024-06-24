import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  supplierCards,
  typeWeights,
  stickers,
  insertPackageResponse,
} from "../../utilities/collections";
import TypeWeightCard from "./TypeWeightCard";
import { useNavigate } from "react-router-dom";
import OutlinedButton from "../OutlinedButton";
import SupplierCard from "../SupplierCard";
import { customTheme } from "../../store/Theme";
import useFetch from "../../utilities/useFetch";
import { buildTypeWeightsCard } from "../../utilities/functions";
import DialogMessage from "../Dialogs/MessageDialog";
import { AppContext } from "../../store/AppContext";
import Loading from "../Loading";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import { ControlPointSharp } from "@mui/icons-material";

function UserPackage() {
  const { sendData, loading, resData, error, setError } = useFetch();

  const navigate = useNavigate();

  const { coupleData, offeredPackage, setCoupleData, setOfferedPackage } =
    useContext(AppContext);

  const [originalSelectedSuppliers, setOriginalSelectedSuppliers] =
    useState(null);

  const [openAltSuppliers, setOpenAltSuppliers] = useState(false);

  const [openMessage, setOpenMessage] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [currentType, setCurrentType] = useState("");

  const [selectedSupplierEmail, setSelectedSupplierEmail] = useState("");

  const [altSupplierEmail, setAltSupplierEmail] = useState("");

  useEffect(() => {
    setOriginalSelectedSuppliers(offeredPackage.selectedSuppliers);
  }, []);

  useEffect(() => {
    localStorage.setItem("offeredPackage", JSON.stringify(offeredPackage));
  }, [offeredPackage]);
  
  useEffect(() => {
    sessionStorage.setItem("currentCouple", JSON.stringify(coupleData));
  }, [coupleData]);

  useEffect(() => {
    if (resData === 204 || resData === 200) {
      const { typeWeights, ...rest } = offeredPackage;
      setCoupleData((prevData) => {
        return {
          ...prevData,
          package: {...rest},
        };
      });
    }
  }, [resData]);

  function handleClick() {
    navigate("/questionnaire");
  }

  function handlePackageApproval() {
    let typeReplacements = [];

    originalSelectedSuppliers.forEach((supplier, index) => {
      if (
        supplier.supplierEmail !==
        offeredPackage.selectedSuppliers[index].supplierEmail
      ) {
        typeReplacements.push(supplier.supplierType);
      }
    });

    const { typeWeights, ...rest } = offeredPackage;

    const coupleWithPackage = {
      ...coupleData,
      package: rest,
      typeWeights,
    };

    if (coupleData.package) {
      sendData("/Packages/updatePackage", "PUT", {
        couple: coupleWithPackage,
        typeReplacements,
        actionString: "Update",
      });
    } else {
      sendData("/Packages/insertPackage", "POST", {
        couple: coupleWithPackage,
        typeReplacements,
        actionString: "Insert",
      });
    }

    setOpenMessage(true);
  }

  // ========= Alternative Suppliers Dialog ==============
  function handleOpenAltSuppliers(supplierType, SupplierEmail) {
    setOpenAltSuppliers(true);
    setCurrentType(supplierType);
    setSelectedSupplierEmail(SupplierEmail);
  }

  function handleCloseAltSuppliers() {
    setOpenAltSuppliers(false);
  }

  function showAltSuppliersDialog() {
    return (
      <DialogMessage
        title="נותני שירות חלופיים"
        open={openAltSuppliers}
        btnValue="בטל החלפה"
        onClose={handleCloseAltSuppliers}
        mode="info"
      >
        {
          <Stack
            direction="row"
            justifyContent="center"
            alignContent="space-around"
            flexWrap="wrap"
            rowGap={3}
            columnGap={2}
          >
            {offeredPackage.alternativeSuppliers[currentType] &&
              offeredPackage.alternativeSuppliers[currentType].map(
                (supplier, index) => (
                  <SupplierCard
                    key={index}
                    props={supplier}
                    cardBg={customTheme.palette.secondary.light}
                    showMoreInfoBtn={false}
                    showReplaceSupplierBtn={true}
                    isAlternative={true}
                    onCheckBtnClick={handleOpenConfirm}
                  />
                )
              )}
          </Stack>
        }
      </DialogMessage>
    );
  }

  // ========= Confirm Dialog ==============
  function handleOpenConfirm(altSupplierEmail) {
    setOpenConfirm(true);
    setAltSupplierEmail(altSupplierEmail);
  }

  function handleCancelConfirm() {
    setOpenConfirm(false);
  }

  function handleCloseConfirm() {
    setOpenConfirm(false);
    setOpenAltSuppliers(false);
    handleReplacementApproval();
  }

  function handleReplacementApproval() {
    //step 1 -> grab the original selectedSuppliers array and altSuppliers array
    const originalSelectedSuppliers = offeredPackage.selectedSuppliers;

    const originalAltSuppliers =
      offeredPackage.alternativeSuppliers[currentType];

    // step 2 -> grab the complete selectedSupplier and altSupplier objects
    const selectedSupplierObj = originalSelectedSuppliers.filter(
      (supplier) => supplier.supplierEmail === selectedSupplierEmail
    )[0];

    const altSupplierObj = originalAltSuppliers.filter(
      (supplier) => supplier.supplierEmail === altSupplierEmail
    )[0];

    // step 3 -> swap each other location
    const newSelectedSuppliers = originalSelectedSuppliers.map((supplier) => {
      if (supplier.supplierEmail === selectedSupplierEmail) {
        return altSupplierObj;
      } else {
        return supplier;
      }
    });

    const newAltSuppliers = originalAltSuppliers.map((supplier) => {
      if (supplier.supplierEmail === altSupplierEmail) {
        return selectedSupplierObj;
      } else {
        return supplier;
      }
    });

    // step 4 -> update package total cost
    const updatedTotalCost = newSelectedSuppliers.reduce(
      (acc, currentSupplier) => {
        return acc + currentSupplier.price;
      },
      0
    );

    // step 5 -> updateCoupleData
    setOfferedPackage((prevData) => {
      return {
        ...prevData,
        alternativeSuppliers: {
          ...prevData.alternativeSuppliers,
          [currentType]: newAltSuppliers,
        },
        selectedSuppliers: newSelectedSuppliers,
        totalCost: updatedTotalCost,
      };
    });

    // setOfferedPackage((prevData) => {
    //   return {
    //     ...prevData,
    //     package: {
    //       ...prevData.package,
    //       alternativeSuppliers: {
    //         ...prevData.package.alternativeSuppliers,
    //         [currentType]: newAltSuppliers,
    //       },
    //       selectedSuppliers: newSelectedSuppliers,
    //       totalCost: updatedTotalCost,
    //     },
    //   };
    // });
  }

  function showConfirmDialog() {
    return (
      <ConfirmDialog
        title="האם אתם בטוחים שאתם רוצים להחליף?"
        open={openConfirm}
        btnValue="הבנתי!"
        onClose={handleCloseConfirm}
        onCancel={handleCancelConfirm}
        mode="info"
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            fontFamily: customTheme.font.main,
            fontSize: { xs: 16, sm: 24 },
            px: 2,
          }}
        >
          ההחלפה תתבצע רק לאחר לחיצה על כפתור "אשר חבילה"
        </Typography>
      </ConfirmDialog>
    );
  }

  // ========= Message Dialog ==============
  function handleCloseMessage() {
    setOpenMessage(false);
    setError(undefined);
  }

  function showErrorDialog(status) {
    if (status === 200) {
      return (
        <DialogMessage
          title="בסימן טוב ומזל טוב!!"
          open={openMessage}
          btnValue="הבנתי!"
          onClose={handleCloseMessage}
          mode="success"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
          >
            {insertPackageResponse[200]}
          </Typography>
        </DialogMessage>
      );
    } else if (status === 409) {
      return (
        <DialogMessage
          title="נראה שאישרתם חבילה זו בעבר..."
          open={openMessage}
          btnValue="הבנתי!"
          onClose={handleCloseMessage}
          mode="error"
        >
          {
            <Stack
              direction="row"
              justifyContent="center"
              alignContent="space-around"
              flexWrap="wrap"
              rowGap={3}
              columnGap={2}
            >
              <Typography
                variant="h6"
                sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
              >
                {insertPackageResponse[status]}
              </Typography>
            </Stack>
          }
        </DialogMessage>
      );
    } else {
      return (
        <DialogMessage
          title="שגיאה"
          open={openMessage}
          btnValue="הבנתי!"
          onClose={handleCloseMessage}
          mode="error"
        >
          {
            <Stack
              direction="row"
              justifyContent="center"
              alignContent="space-around"
              flexWrap="wrap"
              rowGap={3}
              columnGap={2}
            >
              <Typography
                variant="h6"
                sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
              >
                {insertPackageResponse[status]}
              </Typography>
            </Stack>
          }
        </DialogMessage>
      );
    }
  }

  return (
    <Stack
      justifyContent="space-around"
      spacing={5}
      alignItems="center"
      sx={{
        minHeight: "100vh",
        textAlign: "center",
        pb: 10,
        width: "95%",
        margin: "0 auto",
      }}
    >
      {loading && <Loading />}
      {error && showErrorDialog(error)}
      {openConfirm && showConfirmDialog()}
      {openAltSuppliers && showAltSuppliersDialog()}
      <Stack
        spacing={5}
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: "80%" }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          העדפות שלכם (%)
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Grid container sx={cardsContainer}>
            {buildTypeWeightsCard(offeredPackage.typeWeights, stickers).map(
              (type, index) => (
                <TypeWeightCard key={index} props={type} />
              )
            )}
          </Grid>
        </Stack>
      </Stack>
      <Stack
        spacing={3}
        sx={{ width: "100%" }}
        justifyContent="space-around"
        alignItems="center"
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            width: "90%",
            px: { xs: 1, sm: 5 },
          }}
        >
          חבילת נותני השירות המתאימים במיוחד אליכם
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignContent="space-around"
          flexWrap="wrap"
          rowGap={3}
          columnGap={3}
          sx={{ width: { xs: "80%", sm: "70%", lg: "60%" } }}
        >
          {offeredPackage["selectedSuppliers"].map((supplier, index) => (
            <SupplierCard
              key={index}
              props={supplier}
              showMoreInfoBtn={true}
              showReplaceSupplierBtn={true}
              onReplacement={handleOpenAltSuppliers}
              isPackage={true}
            />
          ))}
        </Stack>
        <Stack
          direction="row"
          spacing={3}
          sx={{ width: { xs: "60%", sm: "50%" } }}
        >
          <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
            ציון התאמה עבורכם : {offeredPackage.totalScore.toFixed(2)} מתוך 100
          </Typography>
          <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
            חיסכון מהתקציב : {coupleData.budget - offeredPackage.totalCost} ש"ח
          </Typography>
        </Stack>
      </Stack>
      <Button
        variant="contained"
        sx={heroActionBtn}
        onClick={handlePackageApproval}
      >
        אשר חבילה
      </Button>
      <Stack
        spacing={5}
        alignItems="center"
        sx={{ width: "90%", px: { xs: 1, sm: 5 } }}
      >
        <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
          לא התחברתם לחבילה המומלצת? לא לדאוג... ניתן לענות שוב שאלון העדפות
          ולקבל חבילה חדשה לגמרי.
        </Typography>
        <OutlinedButton btnValue="מילוי שאלון חדש" handleClick={handleClick} />
      </Stack>
    </Stack>
  );
}

export default UserPackage;

const cardsContainer = {
  gridTemplateRows: "repeat( auto-fill, minmax(200px, 1fr) );",
  // gridTemplateRows: 'repeat(3, 1fr)',
  margin: "0 auto",
  width: "100%",
  p: 1,
  rowGap: 3,
};

const heroActionBtn = {
  width: { xs: "70%", sm: "50%" },
  border: 2,
  py: 1,
  px: { xs: 1, sm: 3 },
  fontSize: { xs: 20, sm: 26 },
  bgcolor: "white",
  color: customTheme.palette.secondary.dark,
  ":hover": {
    color: "white",
    bgcolor: customTheme.palette.secondary.dark,
    borderColor: customTheme.palette.secondary.main,
    border: 2,
  },
};
// import { Box, Button, Grid, Stack, Typography } from "@mui/material";
// import React, { useContext, useEffect, useState } from "react";
// import {
//   supplierCards,
//   typeWeights,
//   stickers,
//   insertPackageResponse,
// } from "../../utilities/collections";
// import TypeWeightCard from "./TypeWeightCard";
// import { useNavigate } from "react-router-dom";
// import OutlinedButton from "../OutlinedButton";
// import SupplierCard from "../SupplierCard";
// import { customTheme } from "../../store/Theme";
// import useFetch from "../../utilities/useFetch";
// import { buildTypeWeightsCard } from "../../utilities/functions";
// import DialogMessage from "../Dialogs/MessageDialog";
// import { AppContext } from "../../store/AppContext";
// import Loading from "../Loading";
// import ConfirmDialog from "../Dialogs/ConfirmDialog";

// function UserPackage() {
//   const { sendData, loading, resData, error, setError } = useFetch();

//   const navigate = useNavigate();

//   const { coupleData ,  setCoupleData } = useContext(AppContext);

//   const [originalSelectedSuppliers, setOriginalSelectedSuppliers] =
//     useState(null);

//   const [openAltSuppliers, setOpenAltSuppliers] = useState(false);

//   const [openMessage, setOpenMessage] = useState(false);

//   const [openConfirm, setOpenConfirm] = useState(false);

//   const [currentType, setCurrentType] = useState("");

//   const [selectedSupplierEmail, setSelectedSupplierEmail] = useState("");

//   const [altSupplierEmail, setAltSupplierEmail] = useState("");

//   // const [typeReplacements, setTypeReplacements] = useState([]);

//   useEffect(() => {
//     setOriginalSelectedSuppliers(coupleData.package.selectedSuppliers);
//   }, []);
//   console.log(originalSelectedSuppliers);

//   useEffect(() => {
//     sessionStorage.setItem("currentCouple", JSON.stringify(coupleData));
//   }, [coupleData]);

//   useEffect(() => {
//     if (resData) {
//       console.log(resData)
//     }
//   }, [resData]);

//   function handleClick() {
//     navigate("/questionnaire");
//   }

//   // let packageData = {
//   //   couple: coupleData,
//   //   typeReplacements,
//   //   actionString,
//   // };

//   function handlePackageApproval() {
//     debugger;
//     let actionString = "";
//     let typeReplacements = [];

//     originalSelectedSuppliers.forEach((supplier, index) => {
//       if (
//         supplier.supplierEmail !==
//         coupleData.package.selectedSuppliers[index].supplierEmail
//       ) {
//         typeReplacements.push(supplier.supplierType);
//       }
//     });
//     if (typeReplacements.length > 0) actionString = "Update";
//     else actionString = "Insert";

//     sendData("/Packages/insertPackage", "POST", {
//       couple: coupleData,
//       typeReplacements,
//       actionString,
//     });
//     setOpenMessage(true);
//   }

//   // ========= Alternative Suppliers Dialog ==============
//   function handleOpenAltSuppliers(supplierType, SupplierEmail) {
//     setOpenAltSuppliers(true);
//     setCurrentType(supplierType);
//     setSelectedSupplierEmail(SupplierEmail);
//   }

//   function handleCloseAltSuppliers() {
//     setOpenAltSuppliers(false);
//   }

//   function showAltSuppliersDialog() {
//     return (
//       <DialogMessage
//         title="נותני שירות חלופיים"
//         open={openAltSuppliers}
//         btnValue="בטל החלפה"
//         onClose={handleCloseAltSuppliers}
//         mode="info"
//       >
//         {
//           <Stack
//             direction="row"
//             justifyContent="center"
//             alignContent="space-around"
//             flexWrap="wrap"
//             rowGap={3}
//             columnGap={2}
//           >
//             {coupleData.package.alternativeSuppliers[currentType] &&
//               coupleData.package.alternativeSuppliers[currentType].map(
//                 (supplier, index) => (
//                   <SupplierCard
//                     key={index}
//                     props={supplier}
//                     cardBg={customTheme.palette.secondary.light}
//                     showMoreInfoBtn={false}
//                     showReplaceSupplierBtn={true}
//                     isAlternative={true}
//                     onCheckBtnClick={handleOpenConfirm}
//                   />
//                 )
//               )}
//           </Stack>
//         }
//       </DialogMessage>
//     );
//   }

//   // ========= Confirm Dialog ==============
//   function handleOpenConfirm(altSupplierEmail) {
//     setOpenConfirm(true);
//     setAltSupplierEmail(altSupplierEmail);
//   }

//   function handleCancelConfirm() {
//     setOpenConfirm(false);
//   }

//   function handleCloseConfirm() {
//     setOpenConfirm(false);
//     setOpenAltSuppliers(false);
//     handleReplacementApproval();
//   }

//   function handleReplacementApproval() {
//     //step 1 -> grab the original selectedSuppliers array and altSuppliers array
//     const originalSelectedSuppliers = coupleData.package.selectedSuppliers;

//     const originalAltSuppliers =
//       coupleData.package.alternativeSuppliers[currentType];

//     // step 2 -> grab the complete selectedSupplier and altSupplier objects
//     const selectedSupplierObj = originalSelectedSuppliers.filter(
//       (supplier) => supplier.supplierEmail === selectedSupplierEmail
//     )[0];

//     const altSupplierObj = originalAltSuppliers.filter(
//       (supplier) => supplier.supplierEmail === altSupplierEmail
//     )[0];

//     // step 3 -> swap each other location
//     const newSelectedSuppliers = originalSelectedSuppliers.map((supplier) => {
//       if (supplier.supplierEmail === selectedSupplierEmail) {
//         return altSupplierObj;
//       } else {
//         return supplier;
//       }
//     });

//     const newAltSuppliers = originalAltSuppliers.map((supplier) => {
//       if (supplier.supplierEmail === altSupplierEmail) {
//         return selectedSupplierObj;
//       } else {
//         return supplier;
//       }
//     });

//     // step 4 -> update package total cost
//     const updatedTotalCost = newSelectedSuppliers.reduce(
//       (acc, currentSupplier) => {
//         return acc + currentSupplier.price;
//       },
//       0
//     );

//     // step 5 -> updateCoupleData
//     setCoupleData((prevData) => {
//       return {
//         ...prevData,
//         package: {
//           ...prevData.package,
//           alternativeSuppliers: {
//             ...prevData.package.alternativeSuppliers,
//             [currentType]: newAltSuppliers,
//           },
//           selectedSuppliers: newSelectedSuppliers,
//           totalCost: updatedTotalCost,
//         },
//       };
//     });
//   }

//   function showConfirmDialog() {
//     return (
//       <ConfirmDialog
//         title="האם אתם בטוחים שאתם רוצים להחליף?"
//         open={openConfirm}
//         btnValue="הבנתי!"
//         onClose={handleCloseConfirm}
//         onCancel={handleCancelConfirm}
//         mode="info"
//       >
//         <Typography
//           variant="h6"
//           sx={{
//             textAlign: "center",
//             fontFamily: customTheme.font.main,
//             fontSize: { xs: 16, sm: 24 },
//             px: 2,
//           }}
//         >
//           ההחלפה תתבצע רק לאחר לחיצה על כפתור "אשר חבילה"
//         </Typography>
//       </ConfirmDialog>
//     );
//   }

//   // ========= Message Dialog ==============
//   function handleCloseMessage() {
//     setOpenMessage(false);
//     setError(undefined);
//   }

//   function showErrorDialog(status) {
//     if (status === 200) {
//       return (
//         <DialogMessage
//           title="בסימן טוב ומזל טוב!!"
//           open={openMessage}
//           btnValue="הבנתי!"
//           onClose={handleCloseMessage}
//           mode="success"
//         >
//           <Typography
//             variant="h6"
//             sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
//           >
//             {insertPackageResponse[200]}
//           </Typography>
//         </DialogMessage>
//       );
//     } else if (status === 409) {
//       return (
//         <DialogMessage
//           title="נראה שאישרתם חבילה זו בעבר..."
//           open={openMessage}
//           btnValue="הבנתי!"
//           onClose={handleCloseMessage}
//           mode="error"
//         >
//           {
//             <Stack
//               direction="row"
//               justifyContent="center"
//               alignContent="space-around"
//               flexWrap="wrap"
//               rowGap={3}
//               columnGap={2}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
//               >
//                 {insertPackageResponse[status]}
//               </Typography>
//             </Stack>
//           }
//         </DialogMessage>
//       );
//     } else {
//       return (
//         <DialogMessage
//           title="שגיאה"
//           open={openMessage}
//           btnValue="הבנתי!"
//           onClose={handleCloseMessage}
//           mode="error"
//         >
//           {
//             <Stack
//               direction="row"
//               justifyContent="center"
//               alignContent="space-around"
//               flexWrap="wrap"
//               rowGap={3}
//               columnGap={2}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
//               >
//                 {insertPackageResponse[status]}
//               </Typography>
//             </Stack>
//           }
//         </DialogMessage>
//       );
//     }
//   }

//   return (
//     <Stack
//       justifyContent="space-around"
//       spacing={5}
//       alignItems="center"
//       sx={{
//         minHeight: "100vh",
//         textAlign: "center",
//         pb: 10,
//         width: "95%",
//         margin: "0 auto",
//       }}
//     >
//       {loading && <Loading />}
//       {error && showErrorDialog(error)}
//       {openConfirm && showConfirmDialog()}
//       {openAltSuppliers && showAltSuppliersDialog()}
//       <Stack
//         spacing={5}
//         justifyContent="space-around"
//         alignItems="center"
//         sx={{ width: "80%" }}
//       >
//         <Typography variant="h3" sx={{ fontWeight: "bold" }}>
//           העדפות שלכם (%)
//         </Typography>
//         <Stack
//           direction="row"
//           justifyContent="space-around"
//           alignItems="center"
//           sx={{ width: "100%" }}
//         >
//           <Grid container sx={cardsContainer}>
//             {buildTypeWeightsCard(coupleData.typeWeights, stickers).map(
//               (type, index) => (
//                 <TypeWeightCard key={index} props={type} />
//               )
//             )}
//           </Grid>
//         </Stack>
//       </Stack>
//       <Stack
//         spacing={3}
//         sx={{ width: "100%" }}
//         justifyContent="space-around"
//         alignItems="center"
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             width: "90%",
//             px: { xs: 1, sm: 5 },
//           }}
//         >
//           חבילת נותני השירות המתאימים במיוחד אליכם
//         </Typography>
//         <Stack
//           direction="row"
//           justifyContent="center"
//           alignContent="space-around"
//           flexWrap="wrap"
//           rowGap={3}
//           columnGap={3}
//           sx={{ width: { xs: "80%", sm: "70%", lg: "60%" } }}
//         >
//           {coupleData["package"]["selectedSuppliers"].map((supplier, index) => (
//             <SupplierCard
//               key={index}
//               props={supplier}
//               showMoreInfoBtn={true}
//               showReplaceSupplierBtn={true}
//               onReplacement={handleOpenAltSuppliers}
//               isPackage={true}
//             />
//           ))}
//         </Stack>
//         <Stack
//           direction="row"
//           spacing={3}
//           sx={{ width: { xs: "60%", sm: "50%" } }}
//         >
//           <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
//             ציון התאמה עבורכם - {coupleData.package.totalScore.toFixed(2)} מתוך
//             100
//           </Typography>
//           <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
//             חיסכון מהתקציב - {coupleData.budget - coupleData.package.totalCost}{" "}
//             ש"ח
//           </Typography>
//         </Stack>
//       </Stack>
//       <Button
//         variant="contained"
//         sx={heroActionBtn}
//         onClick={handlePackageApproval}
//       >
//         אשר חבילה
//       </Button>
//       <Stack
//         spacing={5}
//         alignItems="center"
//         sx={{ width: "90%", px: { xs: 1, sm: 5 } }}
//       >
//         <Typography sx={{ typography: { xs: "body1", sm: "h5", md: "h4" } }}>
//           לא התחברתם לחבילה המומלצת? לא לדאוג... ניתן לענות שוב שאלון העדפות
//           ולקבל חבילה חדשה לגמרי.
//         </Typography>
//         <OutlinedButton btnValue="מילוי שאלון חדש" handleClick={handleClick} />
//       </Stack>
//     </Stack>
//   );
// }

// export default UserPackage;

// const cardsContainer = {
//   gridTemplateRows: "repeat( auto-fill, minmax(200px, 1fr) );",
//   // gridTemplateRows: 'repeat(3, 1fr)',
//   margin: "0 auto",
//   width: "100%",
//   p: 1,
//   rowGap: 3,
// };

// const heroActionBtn = {
//   width: { xs: "70%", sm: "50%" },
//   border: 2,
//   py: 1,
//   px: { xs: 1, sm: 3 },
//   fontSize: { xs: 20, sm: 26 },
//   bgcolor: "white",
//   color: customTheme.palette.secondary.dark,
//   ":hover": {
//     color: "white",
//     bgcolor: customTheme.palette.secondary.dark,
//     borderColor: customTheme.palette.secondary.main,
//     border: 2,
//   },
// };
