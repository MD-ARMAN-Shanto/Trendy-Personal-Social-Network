import {
    SET_SCREAMS,
    LOADING_DATA,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM,
    POST_SCREAM,
    SET_SCREAM,
    SUBMIT_COMMENT
} from "../types";


const initialState ={
    screams: [],
    scream: {},
    loading: false
};

export default function (state=initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_SCREAMS:
            return {
                ...state,
                loading: false,
                screams: action.payload
            };
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            var index = state.screams.findIndex(
                (scream) => scream.screamId === action.payload.screamId
            );
            state.screams[index] = action.payload;
            if (state.scream.screamId === action.payload.screamId) {
                state.scream = action.payload;
            }
            return {
                ...state
            };
        case DELETE_SCREAM:
            index = state.screams.findIndex(
                (scream) => scream.screamId === action.payload
            );
            state.screams.splice(index, 1);
            return {
                ...state
            };
        case POST_SCREAM:
            return {
                ...state,
                screams: [action.payload, ...state.screams]
            };
        case SET_SCREAM:
            return {
                ...state,
                scream: action.payload
            };
        case SUBMIT_COMMENT:
            index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
            let updateScreams = JSON.parse(JSON.stringify(state.screams));
            updateScreams[index].commentCount += 1;
            return {
                ...state,
                screams: updateScreams,
                scream: {
                    ...state.scream,
                    comments:[action.payload, ...state.scream.comments],
                    commentCount: state.scream.commentCount + 1
                }
            };

        default:
            return state

    }
}
