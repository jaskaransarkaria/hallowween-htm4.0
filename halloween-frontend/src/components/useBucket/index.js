import { useState } from 'react';
import AWS from 'aws-sdk'

AWS.config.update({
    region: "eu-west-1",
    accessKeyId: `${process.env.REACT_APP_ACCESS_KEY}`,
    secretAccessKey: `${process.env.REACT_APP_SECRET_KEY}`
});
const s3 = new AWS.S3()

const initialState = {
    tricksAndTreats: {
        tricks: [
            "run down the street naked",
            "do a poo in the bin",
            "eat a banana from the floor with no hands"
        ],
        treats: [
            "heres £30 aws credits",
            "ive ordered you an ice cream sundae",
            "free amazon prime for a year!"
        ]
    },
    players: [
        {
            number: "+447982720301",
            name: "matilde"
        },
        {
            number: "+447577506303",
            name: "fanny"
        },
        {
            number: "+447816179261",
            name: "jazz"
        },
        {
            number: "+447894533781",
            name: "ben"
        }
    ]
}

const useBucket = () => {
    const [dataToSend, setDataToSend] = useState(initialState)

    const uploadToBucket = () => {  
        let uploadParams = {
            Bucket: "htm-trick-or-treat",
            Key: "trickOrTreatsTest.json",
            Body: JSON.stringify(dataToSend),
            ContentType: 'application/json'
        }    
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(data)
                }
            })
    }

    const addData = ({type, data}) => {
        console.log({data,type})
      switch(type){
          case 'player':
              setDataToSend({...dataToSend, players:[...dataToSend.players, data]})
        break;
        default:
                setDataToSend({...dataToSend, tricksAndTreats:{...dataToSend.tricksAndTreats, [type]:[...dataToSend.tricksAndTreats[type],data]}})
        break;
    }
    }
    return [dataToSend, addData, uploadToBucket]

}

export default useBucket;