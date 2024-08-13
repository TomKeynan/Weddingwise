import { Button, Grid, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { stickers, insertPackageResponse } from "../../utilities/collections";
import TypeWeightCard from "./TypeWeightCard";
import OutlinedButton from "../buttons/OutlinedButton";
import SupplierCard from "../SupplierCard";
import { customTheme } from "../../store/Theme";
import useFetch from "../../utilities/useFetch";
import {
  addCommasToNumber,
  buildTypeWeightsCard,
} from "../../utilities/functions";
import MessageDialog from "../Dialogs/MessageDialog";
import { AppContext } from "../../store/AppContext";
import Loading from "../Loading";
import ConfirmDialog from "../Dialogs/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  deleteDoc,
  arrayRemove,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../fireBase/firebase";
import { useUserStore } from "../../fireBase/userStore";
import { useGlobalStore } from "../../fireBase/globalLoading";
import KpiPaper from "../KpiPaper";
import { useChatStore } from "../../fireBase/chatStore";

function UserPackage() {
  const navigate = useNavigate();
  const { changeChatStatus } = useChatStore();
  const { sendData, loading, resData, setResData, error, setError } =
    useFetch();

  const { coupleData, offeredPackage, setCoupleData, setOfferedPackage } =
    useContext(AppContext);

  const [originalSelectedSuppliers, setOriginalSelectedSuppliers] =
    useState(null);

  const [openAltSuppliers, setOpenAltSuppliers] = useState(false);

  const [openMessage, setOpenMessage] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);

  const [currentType, setCurrentType] = useState("");

  const [selectedSupplierEmail, setSelectedSupplierEmail] = useState("");

  const [altSupplierEmail, setAltSupplierEmail] = useState("");

  const { currentUser } = useUserStore();

  const { setGlobalLoading, globalLoading } = useGlobalStore();

  useEffect(() => {
    // check if couple ever approve a package
    if (coupleData.package)
      setOriginalSelectedSuppliers(coupleData.package.selectedSuppliers);
    else setOriginalSelectedSuppliers(offeredPackage.selectedSuppliers);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("offeredPackage", JSON.stringify(offeredPackage));
  }, [offeredPackage]);

  useEffect(() => {
    sessionStorage.setItem("currentCouple", JSON.stringify(coupleData));
    if (coupleData.package)
      setOriginalSelectedSuppliers(coupleData.package.selectedSuppliers);
  }, [coupleData]);

  useEffect(() => {
    const updateCoupleData = async () => {
      if (resData) {
        try {
          const { typeWeights, ...rest } = offeredPackage;
          await addSuppliersChats(rest.selectedSuppliers);
          setCoupleData((prevData) => {
            return {
              ...prevData,
              package: { ...rest },
            };
          });
        } catch (err) {
          setGlobalLoading(false);
          console.log(err);
        } finally {
          setGlobalLoading(false);
        }
      }
    };
    updateCoupleData();
  }, [resData]);

  const addSuppliersChats = async (suppliers) => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userChats");
    try {
      // Get the current package from sessionStorage
      const supplierPackage = JSON.parse(
        sessionStorage.getItem("currentCouple")
      ).package;

      if (supplierPackage != null) {
        // Step 1: Delete existing chats
        const userChatsDocRef = doc(userChatsRef, currentUser.id);
        const userChatsDoc = await getDoc(userChatsDocRef);
        const existingChats = userChatsDoc.data()?.chats || [];

        // Delete chat documents from the "chats" collection
        for (const chat of existingChats) {
          const chatId = chat.chatId;
          await deleteDoc(doc(chatRef, chatId));
        }

        // Clear the chats array in the current user's userChats document
        await updateDoc(userChatsDocRef, {
          chats: [],
        });

        // Step 2: Remove chat references from each supplier's userChats document
        for (const supplier of supplierPackage.selectedSuppliers) {
          const userRef = collection(db, "users");
          const q = query(
            userRef,
            where("email", "==", supplier.supplierEmail)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            const supplierId = user.id;

            // Get the userChats document for the supplier
            const supplierUserChatsDocRef = doc(userChatsRef, supplierId);
            const supplierUserChatsDoc = await getDoc(supplierUserChatsDocRef);
            const supplierChats = supplierUserChatsDoc.data()?.chats || [];

            // Remove chat references where receiverId is the current user's ID
            for (const chat of supplierChats) {
              if (chat.receiverId === currentUser.id) {
                // Remove chat from the supplier's userChats document
                await updateDoc(supplierUserChatsDocRef, {
                  chats: arrayRemove(chat),
                });
              }
            }
          }
        }
      }

      // Step 3: Add new chats for the suppliers
      for (const supplier of suppliers) {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", supplier.supplierEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const user = querySnapshot.docs[0].data();
          const supplierId = user.id;

          const newChatRef = doc(chatRef);
          const firstMessage = `!${currentUser.username} רוצים ליצור איתך קשר `;

          await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: [],
          });

          // Update both userChats documents with the new chat
          await updateDoc(doc(userChatsRef, supplierId), {
            chats: arrayUnion({
              chatId: newChatRef.id,
              lastMessage: firstMessage,
              isSeen: false,
              receiverId: currentUser.id,
              updatedAt: Date.now(),
            }),
          });

          await updateDoc(doc(userChatsRef, currentUser.id), {
            chats: arrayUnion({
              chatId: newChatRef.id,
              lastMessage: firstMessage,
              isSeen: false,
              receiverId: supplierId,
              updatedAt: Date.now(),
            }),
          });

          // Add the initial message to the chat
          await updateDoc(doc(db, "chats", newChatRef.id), {
            messages: arrayUnion({
              senderId: currentUser.id,
              text: firstMessage,
              createdAt: new Date(),
            }),
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =============== CONFIRM UPDATE =====================

  function handleCancelUpdateConfirm() {
    setOpenUpdateConfirm(false);
  }

  function showUpdateConfirmDialog() {
    return (
      <ConfirmDialog
        title="שימו לב..."
        open={openUpdateConfirm}
        onCancel={handleCancelUpdateConfirm}
      >
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          לחיצה על אישור תוביל להמלצה על חבילה חדשה לגמרי.
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          האם אתה בטוח שאתה רוצה להחליף את כל נותני השירות?
        </Typography>
      </ConfirmDialog>
    );
  }

  function handlePackageApproval() {
    let typeReplacements = [];
    setGlobalLoading(true);
    setResData(null);
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
      <MessageDialog
        title="נותני שירות חלופיים"
        open={openAltSuppliers}
        btnValue="בטל החלפה"
        onClose={handleCloseAltSuppliers}
        xBtn={handleCloseAltSuppliers}
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
      </MessageDialog>
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
  }

  function showConfirmDialog() {
    return (
      <ConfirmDialog
        title="האם אתם בטוחים שאתם רוצים להחליף?"
        open={openConfirm}
        btnValue="הבנתי!"
        onApproval={handleCloseConfirm}
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
    setResData(undefined);
  }

  function showErrorMessage(status) {
    if (status === 409) {
      return (
        <MessageDialog
          title="נראה שאישרתם חבילה זו בעבר..."
          open={openMessage}
          btnValue="הבנתי!"
          onClose={handleCloseMessage}
          xBtn={handleCloseMessage}
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
        </MessageDialog>
      );
    } else {
      return (
        <MessageDialog
          title="שגיאה"
          open={openMessage}
          btnValue="הבנתי!"
          onClose={handleCloseMessage}
          xBtn={handleCloseMessage}
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
        </MessageDialog>
      );
    }
  }

  function handleCloseSuccessMessage() {
    setOpenMessage(false);
    setError(undefined);
    setResData(undefined);
    changeChatStatus();
  }
  function showSuccessMessage(status) {
    if (status === 200) {
      return (
        <MessageDialog
          title="בסימן טוב ומזל טוב!!"
          open={openMessage}
          btnValue="הבנתי!"
          onClose={handleCloseSuccessMessage}
          xBtn={handleCloseSuccessMessage}
          mode="success"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
          >
            {insertPackageResponse[200]}
          </Typography>
        </MessageDialog>
      );
    } else {
      return (
        <MessageDialog
          title="כל הכבוד👏🏼👏🏼👏🏼"
          open={openMessage}
          btnValue="יש!"
          onClose={handleCloseSuccessMessage}
          xBtn={handleCloseSuccessMessage}
          mode="success"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontFamily: customTheme.font.main }}
          >
            {insertPackageResponse[204]}
          </Typography>
        </MessageDialog>
      );
    }
  }

  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        textAlign: "center",
        pb: 10,
        width: "95%",
        margin: "0 auto",
      }}
    >
      {globalLoading && <Loading />}
      {error && !globalLoading && showErrorMessage(error)}
      {resData && !globalLoading && showSuccessMessage(resData)}
      {openAltSuppliers && showAltSuppliersDialog()}
      {openConfirm && showConfirmDialog()}
      {openUpdateConfirm && showUpdateConfirmDialog()}
      <Stack
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: "80%" }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%", mb: { xs: 1, sm: 4 } }}
        >
          <Typography sx={titleSX}>
            חבילת נותני השירות המתאימים במיוחד אליכם
          </Typography>
        </Stack>
        <Typography sx={{ ...typographySX, py: 2 }}>
          סרגל ההעדפות שלכם על פי התשובות שמילאתם בשאלון :{" "}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          sx={{ width: "100%", mb: 10 }}
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
        sx={{ width: "90%" }}
        justifyContent="space-around"
        alignItems="center"
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            px: { xs: 1, sm: 5 },
            pb: 5,
            fontFamily: customTheme.font.main,
            fontSize: { xs: 26, sm: 34, md: 42 },
          }}
        >
          ועכשיו לחלק האומנותי... נבחרת הספקים המומלצים ביותר בשבילכם!
        </Typography>

        <Stack
          direction="row"
          justifyContent="center"
          alignContent="space-around"
          flexWrap="wrap"
          rowGap={5}
          columnGap={5}
          sx={{ width: { xs: "100%", sm: "70%", lg: "80%" } }}
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
        <Grid
          id="package-approval"
          container
          sx={{ gap: { xs: 2, sm: 5 }, justifyContent: "center", py: 3 }}
        >
          <Grid item xs={12} sm={3}>
            <KpiPaper
              title="ציון ההתאמה "
              data={offeredPackage.totalScore.toFixed(2)}
              icon="%"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <KpiPaper
              title="עלות כוללת "
              data={addCommasToNumber(offeredPackage.totalCost)}
              icon="₪"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <KpiPaper
              title="חיסכון "
              data={addCommasToNumber(
                coupleData.budget - offeredPackage.totalCost
              )}
              icon="₪"
            />
          </Grid>
        </Grid>
        <Stack
          alignItems="center"
          sx={{ width: "90%", px: { xs: 1, sm: 5 }, pt: 5, pb: 5 }}
        >
          <Typography sx={typographySX}>
            מעוניינים לשמוע עוד פרטים מאחד הספקים שהומלצו עבורכם?
          </Typography>
          <Typography sx={typographySX}>
            אשרו את החבילה ותוכלו לפנות אליהם בצ'אט!
          </Typography>
          <Button
            variant="contained"
            sx={heroActionBtn}
            onClick={handlePackageApproval}
          >
            אשר חבילה
          </Button>
        </Stack>
      </Stack>
      <Stack alignItems="center" sx={{ width: "90%", px: { xs: 1, sm: 5 } }}>
        <Typography sx={typographySX}>
          לא התחברתם לחבילה המומלצת? מעדיפים תאריך אחר ליום שלכם?
        </Typography>
        <Typography sx={typographySX}>
          לא לדאוג... ניתן לקבל חבילה חדשה לגמרי.{" "}
        </Typography>
        <OutlinedButton
          btnValue="החלף חבילה"
          handleClick={() => navigate("/edit-replace")}
        />
      </Stack>
    </Stack>
  );
}

export default UserPackage;

const cardsContainer = {
  gridTemplateRows: "repeat( auto-fill, minmax(200px, 1fr) );",
  margin: "0 auto",
  width: "100%",
  p: 1,
  rowGap: 3,
};

const heroActionBtn = {
  width: { xs: "80%", sm: "70%", lg: "60%" },
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

const typographySX = {
  fontSize: { xs: 16, sm: 24, md: 30 },
  mb: 1,
  fontFamily: customTheme.font.main,
};

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 26, sm: 34, md: 42 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 1 },
  textShadow: { xs: "none", sm: "1px 2px 3px #282828" },
};
