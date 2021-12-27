import React, { useEffect, useState } from 'react';
import './App.css';
import * as API from './Socket-api';
interface Numeros{
  a: string,
  b: string,
  resultado: string,

}
function App() {
  const [numeros, setNumeros] = useState<Numeros>({
    a: "",
    b: "",
    resultado: ""
  })
  useEffect(() => {
    console.log(API);
    API.subscribe((resultado:any)=>{
      console.log("este", resultado.result)
      setNumeros({
        a: "",
        b: "",
        resultado: resultado.result
      })
   });
  }, [numeros])
  const handleChange = (event:any)=>{
    setNumeros({
      ...numeros,
      [event.target.name]: event.target.value
    })
  }
  const handleSubmit = (event:any)=>{
    event.preventDefault();

    const params = new URLSearchParams();
    params.append('a', numeros.a);
    params.append('b', numeros.b);

    fetch(`${API.API_URL}/api/calc/sum`, { method: 'POST', body: params })
    .then(res => res.json());
  }
  return (
    <div>
    { numeros.resultado ? (         
      <label>
          Resultado:
          <input type="text" value={numeros.resultado} name='b' readOnly />
      </label>
    ) : ''}
    
      <form onSubmit={handleSubmit}>
        <label>
          A:
          <input type="text" name='a' onChange={handleChange} />
        </label>
        <label>
          B:
          <input type="text"  name='b' onChange={handleChange} />
        </label>
      {numeros.resultado}
            <br/>
        <input type="submit"  value="Add" />
      </form>
    
    </div>
  
    );
  
}

export default App;
