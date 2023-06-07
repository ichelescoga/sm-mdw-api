# novapagos

#Plataforma de soluciones web.
    - Cobros por QR por medio de Visanet.
    - Encuesta NPS (NET PROMOTER SCORE) para San Martín.

#Servidor de produccion :
    3.93.113.56

#Servidor de desarrollo :
    172.16.31.108

#Version de Nodejs
    v10.19.0
    v13.14.0 (current)

#Comandos utiles 
    ps aux | grep node  --Muestra los demonios corriendo.
    
    pm2 list            --muestra los demonios del modulo pm2

#Comandos Sequelize de mapeo actualizados

    sequelize-auto -o "src/modelsSm" -d CTRL_SMMW -h sm-azuredba.121ce7e78182.database.windows.net -u SMOrderMW -p 1433 -x "MidleW@re22" -e mssql -t "MDW_Client" "MDW_Detail_Client" "MDW_Enterprise" "MDW_Order_Detail" "MDW_Order_Store" "MDW_Order" "MDW_Product" "MDW_Store_Map" "MDW_Store" "MDW_User_Order" "MDW_User_Store" "MDW_User_Vehicle" "MDW_User" "Order_Raw_Item" "Order_Raw" "MDW_Store_Alert"

    sequelize-auto -o "src/modelsSm" -d CTRL_SMMW_DEV -h sm-azuredba.121ce7e78182.database.windows.net -u SMOrderMW -p 1433 -x "MidleW@re22" -e mssql -t "MDW_Client" "MDW_Detail_Client" "MDW_Enterprise" "MDW_Order_Detail" "MDW_Order_Store" "MDW_Order" "MDW_Product" "MDW_Store_Map" "MDW_Store" "MDW_User_Order" "MDW_User_Store" "MDW_User_Vehicle" "MDW_User" "Order_Raw_Item" "Order_Raw" "MDW_Store_Alert"