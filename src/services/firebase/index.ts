// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    apiKeyn: process.env.apiKey,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

firebase.initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = firebase.auth();
export const db = firebase.firestore();
export const analytics = firebase.analytics();


export const signInWithRedirectGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: "consent",
    });
    auth.signInWithRedirect(provider);
};

export const getRedirectResult = async () => {
    const result = await auth.getRedirectResult();
    const user = result ? result.user : null;
    return user;
};

export const logout = async () => {
    await auth.signOut();
};

export const getUserID = () => {
    const user = auth.currentUser;
    return user.uid
};


///////////////////////// User /////////////////////////////////////
export const addUser = async (userId, userData) => {
    const docRef = db.collection("users").doc(userId);
    await docRef.set(userData, { merge: true })
}

export const getUser = async (userId) => {
    const userRef = db.collection("users").doc(userId);
    const user = await userRef.get();
    return user.data();
};

export const updateUser = async (userId, userData) => {
    const docRef = db.collection("users").doc(userId);
    await docRef.set(userData, { merge: true })
};

export const getAllUser = async () => {
    const users = [];
    const querySnapshot = await db.collection("users").get();
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    return users;
};

///////////////////////// Income /////////////////////////////////////

export const addIncome = async (income) => {
    const ref = db.collection("transactions").doc();
    const transaction = {
        transactionId: ref.id,
        authorId: getUserID(),
        ...income,
        type: "income",
        created: new Date().toString()
    };
    await ref.set(transaction, { merge: true });
};

export const updateIncome = async (income) => {
    const ref = db.collection("transactions").doc(income.transactionId);
    const transaction = {
        transactionId: ref.id,
        ...income,
        author: null,
        type: "income",
        updated: new Date().toString()
    };
    await ref.set(transaction, { merge: true });
};

export const getAllIncome = async (user) => {
    const transactions = [];
    if (user.isAdmin) {
        const querySnapshot = await db.collection("transactions").where("type", "==", "income").get();
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
    } else {
        const querySnapshot = await db.collection("transactions").where("type", "==", "income").where("authorId", "==", user.uid).get();
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
    }
    const transactionsWithAuthor = await Promise.all(transactions.map(async (transaction) => {
        const author = await getUser(transaction.authorId);
        return ({
            ...transaction,
            author: author
        })
    }))
    return transactionsWithAuthor;
}


///////////////////////// Expense /////////////////////////////////////

export const addExpense = async (expense) => {
    const ref = db.collection("transactions").doc();
    const transaction = {
        transactionId: ref.id,
        authorId: getUserID(),
        ...expense,
        type: "expense",
        created: new Date().toString()
    };
    await ref.set(transaction, { merge: true });
};

export const updateExpense = async (expense) => {
    const ref = db.collection("transactions").doc(expense.transactionId);
    const transaction = {
        transactionId: ref.id,
        ...expense,
        author: null,
        type: "expense",
        updated: new Date().toString()
    };
    await ref.set(transaction, { merge: true });
};

export const getAllExpense = async (user) => {
    const transactions = [];
    if (user.isAdmin) {
        const querySnapshot = await db.collection("transactions").where("type", "==", "expense").get();
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
    } else {
        const querySnapshot = await db.collection("transactions").where("type", "==", "expense").where("authorId", "==", user.uid).get();
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
    }
    const transactionsWithAuthor = await Promise.all(transactions.map(async (transaction) => {
        const author = await getUser(transaction.authorId);
        return ({
            ...transaction,
            author: author
        })
    }))
    return transactionsWithAuthor;
}

///////////////////////// Field /////////////////////////////////////

export const addField = async (field) => {
    const ref = db.collection("fields").doc();
    const fieldData = {
        fieldId: ref.id,
        ...field,
        created: new Date().toString()
    };
    await ref.set(fieldData, { merge: true });
};

export const updateField = async (field) => {
    const ref = db.collection("fields").doc(field.fieldId);
    const transaction = {
        fieldId: ref.id,
        ...field,
        updated: new Date().toString()
    };
    await ref.set(transaction, { merge: true });
};

export const getAllField = async () => {
    const fields = [];
    const querySnapshot = await db.collection("fields").get();
    querySnapshot.forEach((doc) => {
        fields.push(doc.data());
    });
    return fields;
}

export const deleteField = async (field) => {
    const ref = db.collection("fields").doc(field.fieldId);
    await ref.delete();
}


///////////////////////// Transaction /////////////////////////////////////
export const getAllTransactions = async (user) => {
    const transactions = [];
    if (user.isAdmin) {
        const querySnapshot = await db.collection("transactions").get();
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
    } else {
        const querySnapshot = await db.collection("transactions").where("authorId", "==", user.uid).get();
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
        });
    }
    const transactionsWithAuthor = await Promise.all(transactions.map(async (transaction) => {
        const author = await getUser(transaction.authorId);
        return ({
            ...transaction,
            author: author
        })
    }))
    return transactionsWithAuthor;
}

export const deleteTransaction = async (transaction) => {
    const ref = db.collection("transactions").doc(transaction.transactionId);
    await ref.delete();
}

/////////////////////////////allowedUsers//////////////////////////////////////
export const addAllowedUsers = async (user) => {
    const userExist = await checkAllowedUsers(user.email);
    if (userExist) {
        throw new Error("This email has been added already")
    }
    const ref = db.collection("allowed-users").doc();
    const transaction = {
        allowedUserId: ref.id,
        email: user.email.trim().toLowerCase(),
        created: new Date().toString()
    };
    await ref.set(transaction, { merge: true });
};

export const deleteAllowedUsers = async (user) => {
    const ref = db.collection("allowed-users").doc(user.allowedUserId);
    await ref.delete();
}

export const checkAllowedUsers = async (email) => {
    const users = [];
    const querySnapshot = await db.collection("allowed-users").where("email", "==", email.trim().toLowerCase()).get();
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    return users[0];
};

export const getAllowedUsers = async () => {
    const users = [];
    const querySnapshot = await db.collection("allowed-users").get();
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    return users;
};

