import { useState, useEffect } from "react";
import { storage, firestore, auth } from "../firebase/setup";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { collection,  setDoc,  arrayUnion, getDoc ,doc } from "firebase/firestore";
import { constants } from "../../constants/generic_constants";
import { v4 as uuidv4 } from 'uuid';


function UploadFile() {
  // State to store uploaded file
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const userFilesCollection = collection(firestore,constants.USER_COLLECTION_NAME);
  const fileCollection = collection(firestore, constants.FILE_COLLECTION_NAME);
  const [user, setUser] = useState(auth.currentUser);
  const [formSubmitted, setFormSubmitted] = useState(false);
  // Handle file upload event and update state
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function generateUniqueID() {
    const timestamp = Date.now().toString(36); // Convert timestamp to base 36
    const randomString = Math.random().toString(36).substr(2, 10); // Generate random string
    const uniqueID = timestamp + randomString; // Concatenate timestamp and random string

    return uniqueID;
  }

  const generateUniqueLink = () => {
    const randomString = uuidv4();
    const link = `https://pdf.com/shared/${randomString}`;
    return link;
  };
  
  const checkIfFileExists = async (fileName) => {
    const storageRef = ref(storage, "/files");
    const fileList = await listAll(storageRef);
    const existingFile = fileList.items.find((file) => file.name === fileName);
    return !!existingFile;
  };

  const handleUpload = async() => {
    if (!file) {
      alert("Please upload an pdf file first!");
    }

    const storageRef = ref(storage, `/files/${file.name}`);
    const fileName = file.name;

  // Check if file with the same name already exists
    const fileExists = await checkIfFileExists(fileName);
    if (fileExists) {
      alert("File with the same name already exists. Please choose a different file.");
      return;
    }

    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url is generated once file is uploaded successfully
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          // upon successful uploading of the file we will store the  file details in our various tables
          console.log(url)
          const user = auth.currentUser; // this is bad coding practice,
          const fileId = generateUniqueID();
          const fileIds = [fileId];
          try {
            // Check if a document with the current user's email already exists in userFilesCollection

            const docRef = doc(firestore,constants.USER_COLLECTION_NAME , user.email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              await setDoc(
                docRef,
                {
                  fileIds: arrayUnion(fileId),
                },
                { merge: true }
              );
    
              console.log("User file list successfully updated:", docRef.id);
            } else {
              // Create a new document since no document with the user's email exists
              const docRef = await setDoc(doc(userFilesCollection,user.email), {
                email: user.email,
                fileIds: fileIds,
              });
    
              console.log("New user file list created:");
            }
    
            const filedocRef = await setDoc(doc(fileCollection,fileId ),{
              fileId: fileId,
              fileName: file.name,
              downloadUrl: url,
              accessLink: generateUniqueLink(),
            });
            setFormSubmitted(true);
           setFile("");
            console.log("File details stored in fileCollection:");
          } catch (error) {
            console.error("Error updating user file list:", error);
          }
        });
      }
    );
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    setFormSubmitted(false);
    return () => {
      unsubscribe();
    };
  }, [formSubmitted]);
  return (
    <>
    <div className=" h-screen flex  justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleUpload}>
          <div className="my-5">
            <label htmlFor="fileUpload" className="sr-only">
              Choose a file
            </label>
            <div className="flex items-center justify-center">
              
              <input
                  type="file"
                  onChange={handleChange}
                  accept="application/pdf"
                  id="fileUpload"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                />
              <button
                type="button"
                onClick={handleUpload}
                className="group relative ml-5 w-50 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500"
              >
                Upload
              </button>
            </div>
          </div>

          <p>{percent}% done</p>
        </form>
        <hr />
      </div>
      
    </div>
   
    </>
  );
}

export default UploadFile;
