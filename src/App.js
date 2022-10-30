import React, { useEffect, useState } from 'react'
import { useLoadScript } from "@react-google-maps/api"
import logo from './img/logo1.png'
import logo1 from './img/logo.png'
import './css/App.css'
import Map from "./components/Map"
import Result from "./components/Result"
import List from "./components/List"
import Search from "./components/Search"
import 'bootstrap/dist/css/bootstrap.min.css'
import { BounceLoader } from 'react-spinners'
import { Container, Navbar, NavbarBrand, Row, Col, InputGroup, Input, Button } from 'reactstrap'




export default function App () {
  const [markers, setMarkers] = useState(null)
  const [topTen, setTopTen] = useState(null)
  const [searchID, setSearchID] = useState([])
  const [searchDescription, setSearchDescription] = useState([])
  const [del, setDel] = useState()
  const [searching, setSearching] = useState([])
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(false)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCQ1LyU9d52CXM2acseyFBFhU9SlHv9HXQ"
  })

  async function getData () {
    let res = await fetch("/init")
    let data = await res.json()
    let mar = await data.apiInfo.info
    let top = await data.TopTen.data
    console.log(data)
    return [mar, top]
  }

  async function search () {
    setLoading(true)
    setCount(null)
    let s = searchDescription
    setSearching(s)
    try {
      let res = await fetch("/traffic", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchID)
      })
      let data = await res.json()
      setCount(data.countInfo)
      console.log(data.countInfo)
    } catch {

    }
  }


  async function deleteList () {
    let id = searchID
    let description = searchDescription
    let num
    description.map((i, n) => {
      if (i == del) {
        num = n
        console.log(i)
      }
    })
    id.splice(num, 1)
    description.splice(num, 1)
    setSearchID(id)
    setSearchDescription(description)
    setLoading(false)
  }

  useEffect(() => {
    (async () => {
      try {
        const [mar, top] = await getData()
        await setMarkers(mar)
        await setTopTen(top)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        deleteList()
      } catch (err) {
        console.log(err)
      }
    })()
  }, [del])

  return (
    <div className="App home">

      <header>
        <Navbar
          className="nav"
        >
          <NavbarBrand className="navfont">
            <img
              alt="logo"
              src={logo}
              style={{
                height: 40,
                width: 60,
              }}
            />
            <img
              alt="logo"
              src={logo1}
              style={{
                height: 40,
                width: 60,
              }}
            />
          </NavbarBrand>
        </Navbar>
      </header>

      <main className='main'>

        <section>
          <Container>
            <Row>
              <Col>
                <h1 className="bigtitle">Traffic-Aid</h1>
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container>
            <Row>
              <Col>
                <Result searching={searching} count={count} loading={loading} />
              </Col>
            </Row>
          </Container>
        </section>

        <section className='fix'>
          <Container>
            <Row>
              <Col>
                <Search searchID={searchID} searchDescription={searchDescription} setDel={setDel} search={search} />
              </Col>
            </Row>
          </Container>
        </section>
        {
          markers == null ?
            <section className='fix'>
              <Container>
                <Row>
                  <Col>
                    <BounceLoader
                      color="#36d7b7"
                      size={100}
                      className='load'
                    />
                  </Col>
                </Row>
              </Container>
            </section>
            :
            <section>
              <Container>
                <Row>
                  <Col>
                    <List topTen={topTen} />
                  </Col>
                  <Col>
                    {isLoaded ? <Map markers={markers} setSearchID={setSearchID} setSearchDescription={setSearchDescription} searchID={searchID} searchDescription={searchDescription} /> : null}
                  </Col>
                </Row>
              </Container>
            </section>
        }
      </main>

      <footer>
        <div className='container-fluid footer'>
          <div>Copyright © 2022 PINK</div>
        </div>
      </footer>

    </div>
  )
}
