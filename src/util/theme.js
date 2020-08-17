export default  {
    palette: {
        primary: {
            light: '#33c9dc',
            main: '#00bcd4',
            dark: '#008394',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff6333',
            main: '#ff3d00',
            dark: '#b22a00',
            contrastText: '#fff',
        },
    },
    typography: {
        useNextVariants: true,
    },
    spreadIt:{
        form:{
            textAlign: 'center'
        },
        title:{
            margin: '10px auto 10px auto',
        },
        image:{
            width: 50,
            margin:'20px auto 20px auto'
        },
        textField:{
            margin: '10px auto 10px auto'
        },
        button:{
            marginTop: 20,
            position: 'relative'
        },
        customError:{
            color: 'red',
            fontSize:'0.8rem',
            marginTop: 10
        },
        progress:{
            position: 'absolute'
        },
        link:{
            color:'#00bcd4'
        },
        invisibleSeparator: {
            border: 'none',
            margin: 4
        },
        visibleSeparator: {
            width: '100%',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
        },

    }
}
