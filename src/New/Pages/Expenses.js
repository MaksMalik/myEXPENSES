import * as React from 'react';
import {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {FormControl, InputLabel, Select, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {db} from "../../Firebase/firebase";
import {collection, addDoc, onSnapshot } from "firebase/firestore"
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";


const Expenses = ({realUser,}) => {
  const [transactions, setTransactions] = useState([])
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState()
  const [transactionType, setTransactionType] = useState('income')
  const [transactionCategory, setTransactionCategory] = useState('bills')

  const [transactionName, setTransactionName] = useState()

  const transactionCollection = collection(db, 'Transactions/users/' + realUser?.uid)

  let navigate = useNavigate()

  const handleChange =  async () => {
    if (transactionType && transactionName && amount && transactionCategory) {
      await addDoc(transactionCollection, {
        id: transactions.length + 1,
        name: transactionName,
        type: transactionType,
        amount: amount,
        category: transactionCategory,
        user_id: `${realUser?.uid}`,
        balance: (transactionType === 'income' ? balance + parseFloat(amount) : balance - parseFloat(amount))
        }
      )
      .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    onSnapshot(collection(db, "Transactions/users/" + realUser?.uid), (snapshot) => {
      setTransactions((snapshot.docs.map(doc => doc.data())).sort((a, b) => {
        return a.id - b.id
      }))
      const newBalance = (((snapshot.docs.map(doc => doc.data())).sort((a, b) => {
        return a.id - b.id
      })).slice(-1).pop()?.balance)
      setBalance(!newBalance ? 0 : newBalance)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [])

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Paper style={{ maxHeight: 'minContent', padding:"30px", backgroundColor: 'rgba(0,0,0,0.21)'}}>
                <Typography style={{color: "rgba(255,255,255,0.85)", textAlign: "center"}} variant="h5" >
                  {realUser?.displayName ? <>{realUser.displayName}, your balance:</> : ("Your balance:")} {balance} zł
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              lg={3}
              sm={5}
              xl={3}
              xs={12}
            >
              <Paper style={{ height: '400px', maxHeight: '600px', backgroundColor: 'rgba(0,0,0,0.21)'}}>
                <Box sx={{display: 'flex',justifyContent: 'center',flexWrap: 'wrap', '& > :not(style)': { m: 3, width: '100%', height: 'minContent',},}}>
                  <TextField
                    id="outlined-number"
                    label="Amount"
                    type="number"
                    onChange={(event) =>  setAmount(event.target.value)}
                  />

                  <TextField
                    id="outlined-password-input"
                    label="Purpose"
                    onChange={(event) => setTransactionName(event.target.value)}
                  />

                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={transactionType}
                      label="Type"
                      onChange={(event) => setTransactionType(event.target.value)}
                    >
                      <MenuItem value="expense">Expense</MenuItem>
                      <MenuItem value="income">Income</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={transactionCategory}
                      label="Category"
                      onChange={(event) => setTransactionCategory(event.target.value)}
                    >
                      <MenuItem value="bills">Bills</MenuItem>
                      <MenuItem value="food">Food</MenuItem>
                      <MenuItem value="car">Car</MenuItem>
                      <MenuItem value="travel">Travel</MenuItem>
                      <MenuItem value="gift">Gift</MenuItem>
                    </Select>
                  </FormControl>

                  <button onClick={handleChange}>Dodaj</button>
                </Box>
              </Paper>
            </Grid>

            <Grid
              item
              lg={9}
              sm={7}
              xl={9}
              xs={12}
            >
              <Paper style={{ height: '400px', maxHeight: '600px',backgroundColor: 'rgba(0,0,0,0)'}}>
                <ul> Latest Transactions
                  {transactions.map((transaction, index) => (
                    <li key={index}>
                      <div>{transaction.name}</div>
                      <div>{transaction.type === "income" ?
                        (<span className="deposit">+ {transaction.amount}</span>) :
                        (<span className="income">- {transaction.amount}</span>)}
                      </div>
                    </li>
                    )
                  )}
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Expenses