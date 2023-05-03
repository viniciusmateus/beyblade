const firebaseConfig = {
	apiKey: "AIzaSyAX9Y48UiS4KFzUi9iQIjewc9vPgSNhPCg",
	authDomain: "beybladechampionshipcwb.firebaseapp.com",
	databaseURL: "https://beybladechampionshipcwb-default-rtdb.firebaseio.com",
	projectId: "beybladechampionshipcwb",
	storageBucket: "beybladechampionshipcwb.appspot.com",
	messagingSenderId: "585230748782",
	appId: "1:585230748782:web:76544b3fb71cf56a7dea7f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
