import React, { useState } from 'react'
import { Typography, Input, Button, Alert } from 'antd';
import styles from '../styles/Home.module.css'
const axios = require('axios');
const R = require('ramda');

const { Title } = Typography

const Home = () => {

  const [text, setText] = useState('')
  const [searchError, setSearchError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState({})

  const handleValidate = (value) => {
    if (value.trim().length === 8) {
      setError(false)
      return false
    } else {
      setError(true)
      return true
    }
  }

  const searchCEP = async (value) => {
    setLoading(true)
    await axios.get(`https://viacep.com.br/ws/${value}/json/`)
      .then(function (response) {
        console.log(response.data)
        setData(response.data)
        setLoading(false)
      })
      .catch(function (error) {
        setSearchError(true)
      })
  }

  const handleReset = () => {
    setData({})
    setError(false)
    setText('')
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>

        <Title>Search for CEP</Title>

        <div>
          <div className={styles.wrapper}>

            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a CEP"
              data-testid="search-input"
            />
            <Button
              loading={loading ? true : false}
              type="primary"
              onClick={() => (!handleValidate(text)) && searchCEP(text)}
              data-testid="search-button"
            >Search</Button>
          </div>
          {
            error && <Alert
              message="This field must have 8 characters!"
              type="error"
              showIcon data-testid="search-error"
            />
          }
        </div>

        {
          !R.isEmpty(data) &&
          <div>
            <div style={{ paddingTop: 20 }}>
              {
                data.erro ?
                  <Title level={1}>Invalid CEP</Title>
                  :
                  <Title level={1}>CEP: {data.cep}</Title>
              }
            </div>

            <div>
              <Button danger onClick={handleReset}>Reset</Button>
            </div>
          </div>
        }

        {
          searchError &&
          <Title>
            Something went wrong please verify your <br /> internet connection and try again!
           </Title>
        }

      </main>
    </div>
  )
}

export default Home
