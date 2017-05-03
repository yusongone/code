const Commond={

}


const Device={
    /*

    * */
    "pm2.5":{
        sendData:[
            [0x81], //传入端口
            [0x01], //传感器类型
            [0x01], //环境组
            [0x00,0x00], // 国标PM2.5含量
            [0x00,0x00] // 美标PM2.5含量
        ],
        receiveCommond:[
            [0x82],  //广播
             [0x01] //寻找传感器设备
                [传感器类型]    [0x01]  //pm2.5设备

        ]
        }

    }

}

