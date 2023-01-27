import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authenticate } from '../../store/store';
import { Button, TextField, Box, FormControl, InputLabel, Select, MenuItem} from '@mui/material';


/**
  The AuthForm component can be used for Login or Sign Up.
  Props for Login: name="login", displayName="Login"
  Props for Sign up: name="signup", displayName="Sign Up"
**/


const AuthForm = ({ name, displayName }) => {
  const { error } = useSelector((state) => state.auth);
  // add state to role
  const [role, setRole] = useState('');
  console.log("role-->", role)
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const formName = evt.target.name;
    const email = evt.target.email.value;
    const password = evt.target.password.value;

    console.log("formName-->", formName)
    console.log("email-->", email)
    console.log("password-->", password)

    let role = ""
    let firstName = "" 
    let lastName = ""
    let bio = ""
    let mobileNumber = ""

    if (formName === "signup") {
      role = evt.target.role.value;
      console.log("role-->", role)

      firstName = evt.target.firstName.value;
      console.log("firstName-->", firstName)

      lastName = evt.target.lastName.value;
      console.log("lastName-->", lastName)  

      bio = evt.target.bio.value;
      console.log("bio-->", bio)  

      mobileNumber = evt.target.mobileNumber.value;
      console.log("mobileNumber-->", mobileNumber)  

    }
    dispatch(authenticate({ role, firstName, lastName, bio ,mobileNumber, email, password, method: formName }));

  };

  return (
    
    <div className='authForm'>
      <form onSubmit={handleSubmit} name={name}>

        {name === "signup" ? (
          <div>
            
            <div>
              <FormControl className="form-control">
                <InputLabel id="demo-simple-select-label">
                  Role
                </InputLabel>
                <Select


                  labelId="demo-simple-select-label"
                  value={role}
                  label="Guests"
                  onChange={(e) => setRole(e.target.value)}
                  sx={{ width: "25ch" }}
                  placeholder="Role"
                >
                  <MenuItem value="member" onChange={(e) => setRole(e.target.value)}>Member</MenuItem>
                  <MenuItem value="chef" onChange={(e) => setRole(e.target.value)}>Chef</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div>
            <FormControl className="form-control">
              <TextField name='firstName' type="text" placeholder='First Name' />
            </FormControl>
            </div>


            <div>
              <TextField name='lastName' type="text" placeholder='Last Name' />
            </div>

            <div>
              <TextField name='bio' type="text" placeholder='Bio' />
            </div>

            <div>
              <TextField name='mobileNumber' type="text" placeholder='Mobile Number' />
            </div>

      
          </div>
        ) : null }
        <div>
          <TextField name="email" type="text" placeholder='Email'  />
        </div>
        <div>
          <TextField name="password" type="password" placeholder='Password'  />
        </div>
        <div>
          <Button type="submit" variant="contained" color="primary">
          {displayName}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;




















// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { authenticate } from '../../store/store';
// import { Button, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// /**
//   The AuthForm component can be used for Login or Sign Up.
//   Props for Login: name="login", displayName="Login"
//   Props for Sign up: name="signup", displayName="Sign Up"
// **/

// const AuthForm = ({ name, displayName }) => {
//   const { error } = useSelector((state) => state.auth);
//   // add state to role
//   const [role, setRole] = useState('');
//   console.log("role-->", role)
//   const dispatch = useDispatch();

//   const handleSubmit = (evt) => {
//     evt.preventDefault();
//     const formName = evt.target.name;
//     const email = evt.target.email.value;
//     const password = evt.target.password.value;

//     console.log("formName-->", formName)
//     console.log("email-->", email)
//     console.log("password-->", password)

//     let role = ""
//     let firstName = "" 
//     let lastName = ""
//     let bio = ""
//     let mobileNumber = ""

//     if (formName === "signup") {
//       role = evt.target.role.value;
//       console.log("role-->", role)

//       firstName = evt.target.firstName.value;
//       console.log("firstName-->", firstName)

//       lastName = evt.target.lastName.value;
//       console.log("lastName-->", lastName)  

//       bio = evt.target.bio.value;
//       console.log("bio-->", bio)  

//       mobileNumber = evt.target.mobileNumber.value;
//       console.log("mobileNumber-->", mobileNumber)  

//     }
//     dispatch(authenticate({ role, firstName, lastName, bio ,mobileNumber, email, password, method: formName }));

//   };

//   return (
    
//     <div className='authForm'>
//       <form onSubmit={handleSubmit} name={name}>

//         {name === "signup" ? (
//           <div>
            
//             <div>
//               <FormControl className="form-control">
//                 <InputLabel id="demo-simple-select-label">
//                   Role
//                 </InputLabel>
//                 <Select


//                   labelId="demo-simple-select-label"
//                   value={role}
//                   label="Guests"
//                   onChange={(e) => setRole(e.target.value)}
//                   sx={{ width: "25ch" }}
//                   placeholder="Role"
//                 >
//                   <MenuItem value="member" onChange={(e) => setRole(e.target.value)}>Member</MenuItem>
//                   <MenuItem value="chef" onChange={(e) => setRole(e.target.value)}>Chef</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>

//             <div>
//             <FormControl className="form-control">
//               <TextField name='firstName' type="text" placeholder='First Name' />
//             </FormControl>
//             </div>


//             <div>
//               <TextField name='lastName' type="text" placeholder='Last Name' />
//             </div>

//             <div>
//               <TextField name='bio' type="text" placeholder='Bio' />
//             </div>

//             <div>
//               <TextField name='mobileNumber' type="text" placeholder='Mobile Number' />
//             </div>

      
//           </div>
//         ) : null }
//         <div>
//           <TextField name="email" type="text" placeholder='Email'  />
//         </div>
//         <div>
//           <TextField name="password" type="password" placeholder='Password'  />
//         </div>
//         <div>
//           <Button type="submit" variant="contained" color="primary">
//           {displayName}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AuthForm;
