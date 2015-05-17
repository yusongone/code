int a=0;
int ledPower=2;



void setup(){
 pinMode(13,OUTPUT); 
 pinMode(ledPower,OUTPUT); 
// pinMode(A1,INPUT);
 Serial.begin(9600);
}

int value=0;
int t=0;
int count=0;

long time1=0;
long time2=0;

void loop(){

  digitalWrite(ledPower,LOW);
  delayMicroseconds(280);
  value=0.2*value+0.8*analogRead(A1);
  count++;
  delayMicroseconds(40);
  digitalWrite(ledPower,HIGH);

    t+=value;
    if(count==20){
      Serial.print(t/20);
      Serial.println(",");
      count=0;
      t=0;
    }
    delay(100);
    flash(value);
}
void flash(int val){
      digitalWrite(13,LOW);
      time1=millis();
      if(time1-time2>2000-3*val){
        digitalWrite(13,HIGH);
        time2=time1;
      }else{
      }
  }
