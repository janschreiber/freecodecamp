var calcArray = ['=', 1, '0', '0'];
var result = 0;
var not_ch = 0;
var error_string = 'error';

function initialize()
{
      calcArray = ['=', 1, '0', '0'];
      document.getElementById('display').value = 0;
      document.getElementById('display').focus();
      return true;
}

function numKeyClicked( key )
{
      if (calcArray[1] == 1) // Is this the first digit of a number being entered?
      {
            document.getElementById('display').value = key;
      }
      else
      {
            document.getElementById('display').value += key;
      }
      if (calcArray[0] == '=')
      {
            calcArray[2] = document.getElementById('display').value;
            calcArray[3] = 0;
      }
      else
      {
            calcArray[3] = document.getElementById('display').value;
      }
      calcArray[1] = 0;
      document.getElementById('display').focus();
      return true;
}

function funcKeyClicked( key )
{
      // delete all
      if (key == 'ac')
      {
            initialize();
      }
      // delete backwards
      else if (key == 'bksp')
      {
            displayValue = document.getElementById('display').value;
            if (isNaN(displayValue))
            {
                  initialize();
            }
            if ( (displayValue < 0 && displayValue.length < 3) || (displayValue >= 0 && displayValue.length < 2) )
            {
                  document.getElementById('display').value = 0;
                  calcArray[1] = 1;
            }
            else
            {
                  document.getElementById('display').value = document.getElementById('display').value.slice(0,document.getElementById('display').value.length-1);
                  calcArray[1] = 0;
            }
            if (calcArray[0] == '=')
            {
                  calcArray[2] = document.getElementById('display').value;
                  calcArray[3] = 0;
            }
            else
            {
                  calcArray[3] = document.getElementById('display').value;
            }
            document.getElementById('display').focus();
            return true;
      }
      // equals sign
      else if (key == '=')
      {
            if (calcArray[0] != '=' && calcArray[1] != 1)
            {
                  try
                  {
                        eval('result = '+calcArray[2]+calcArray[0]+calcArray[3]+';');
                  }
                  catch(err)
                  {
                        computationError();
                        return false;
                  }
                  if (result == 'Infinity')
                  {
                        computationError();
                        return false;
                  }
                  document.getElementById('display').value = result;
                  calcArray[0] = '=';
                  calcArray[2] = result;
                  calcArray[3] = 0;
            }
      }
      // swap sign
      else if (key == 'swap_sign')
      {
            num = document.getElementById('display').value * (-1);
            document.getElementById('display').value = num;
            // handle negative numbers
            if (num < 0)
            {
                  str = '(' + num + ')';
            }
            else
            {
                  str = num;
            }
            if (calcArray[0] == '=')
            {
                  calcArray[2] = str;
                  calcArray[3] = 0;
            }
            else
            {
                  calcArray[3] = str;
            }
            not_ch = 1;
      }
      else
      {
            if (calcArray[0] != '=' && calcArray[1] != 1)
            {
                  try
                  {
                        eval('result = '+calcArray[2]+calcArray[0]+calcArray[3]+';');
                  }
                  catch(err)
                  {
                        computationError();
                        return false;
                  }
                  if (result == 'Infinity')
                  {
                        computationError();
                        return false;
                  }
                  document.getElementById('display').value = result;
                  calcArray[2] = result;
                  calcArray[3] = 0;
            }
            calcArray[0] = key;
      }
      if (not_ch == 0)
      {
            calcArray[1] = 1;
      }
      else
      {
            not_ch = 0;
      }
      document.getElementById('display').focus();
      return true;
}

function keyHandler( event )
{
      var evt = event || window.event;
      var charCode = evt.which || evt.keyCode;
      var charTyped = String.fromCharCode(charCode);
      // console.log("Character typed: " + charTyped + "" + charCode);

      if (charTyped >= 0 && charTyped <= 9)
      {
            numKeyClicked(charTyped);
      }
      else if (charCode == 8)
      {
            funcKeyClicked('bksp');
      }
      else if (charTyped == '=')
      {
            funcKeyClicked('=');
      }
      else if (charCode == 106 || charTyped == '*')
      {
            funcKeyClicked('*');
      }
      else if (charCode == 107 || charTyped == '+')
      {
            funcKeyClicked('+');
      }
      else if (charCode == 109 || charTyped == '-')
      {
            funcKeyClicked('-');
      }
      else if (charCode == 111 || charTyped == '\/')
      {
            funcKeyClicked('\/');
      }
      else if (charCode == 110 || charTyped == '.' || charTyped == ',')
      {
            funcKeyClicked('.');
      }
      return true;
}

// Determine if user pressed enter
document.onkeypress = function(evt)
{
      evt = evt || window.event;
      var charCode = evt.which || evt.keyCode;
      var charTyped = String.fromCharCode(charCode);
      if (document.getElementById('display') == document.activeElement && (charCode == 13 || charCode == 187))
      {
            funcKeyClicked('=');
      }
}

function computationError()
{
      calcArray = ['=', 1, '0', '0'];
      not_ch = 0;
      document.getElementById('display').value = error_string;
      document.getElementById('display').focus();
      return true;
}

function infoDlgOpen()
{
}