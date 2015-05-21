void itostr(char* buffer, int v) {
   char temp[3];
  
   //temp="";
   
    if (v>99999) {

        snprintf(buffer,4,"%3i",v);
    } else

        if (v>9999) {
            snprintf(buffer,4,"%3i",v);
             snprintf(temp,2,"k");
             buffer[3] = temp[1];
            
        } else

            if (v>999) {
                
                snprintf(buffer,4,"%3i",v);
                buffer[3] = buffer[2];
                snprintf(temp,2,"k");
                buffer[2] = temp[1];
            } else
                if (v>99) {
                    snprintf(buffer,4,"%3i",v);

                } else
                    if (v>9) {
                        snprintf(buffer,4,"%3i",v);

                    } else {
                        snprintf(buffer,4,"%3i",v);

                    }

}

