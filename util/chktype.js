/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * chktype script. Various functions for checking a string to have a certain type.
 * 
 * ~~~developed by ggtylerr~~~
 */

const StringType = {
  validate: (val) => {
		return true;
	},
  parse: (val) => {
    return val;
  },
  max: (val,max) => {
    return false;
  }
}

const IntegerType = {
  validate: (val) => {
    const int = Number.parseInt(val);
		if(Number.isNaN(int)) return false;
    return true;
  },
  parse: (val) => {
    return Number.parseInt(val);
  },
  max: (val,max) => {
    return (val > max);
  }
}

const BooleanChecks = {
  t: new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']),
	f: new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']),
}

const BooleanType = {
  validate: (val) => {
    const c = BooleanChecks;
    const lc = val.toLowerCase();
		return c.t.has(lc) || c.f.has(lc);
  },
  parse: (val) => {
    const c = BooleanChecks;
    const lc = val.toLowerCase();
		if(c.t.has(lc)) return true;
		if(c.f.has(lc)) return false;
		throw new RangeError('Unknown boolean value.');
  },
  max: (val,max) => {
    return (val && !max);
  }
}

const JSONType = {
  validate: (val) => {
    try {
      var o = JSON.parse(val);
      if (o && typeof o === 'object') return true;
    } catch (e) {
      return e.message;
    }
  },
  parse: (val) => {
    return JSON.parse(val);
  },
  max: (val,max) => {
    return false;
  }
}

const YTDLChecks = {
  highest: new Set([
    'highest','high','best','good',
    'highestaudio','highaudio','bestaudio','goodaudio',
    'highestvid','highvid','bestvid','goodvid',
    'highestvideo','highvideo','bestvideo','goodvideo',
    'highestsong','highsong','bestsong','goodsong',
    'highestquality','highquality','bestquality','goodquality',
  ]),
  lowest: new Set([
    'lowest','lowest','low','worst','worse','bad',
    'lowestaudio','lowestaudio','lowaudio','worstaudio','worseaudio','badaudio',
    'lowestvid','lowestvid','lowvid','worstvid','worsevid','badvid',
    'lowestvideo','lowesvideo','lowvideo','worstvideo','worsevideo','badvideo',
    'lowestsong','lowestsong','lowsong','worstsong','worssonge','badsong',
    'lowestquality','lowestquality','lowquality','worstquality','worsequality','badquality',
  ])
}

const YTDLType = {
  validate: (val) => {
    const c = YTDLChecks;
    const lc = val.toLowerCase();
    return c.highest.has(lc) || c.lowest.has(lc);
  },
  parse: (val) => {
    const c = YTDLChecks;
    const lc = val.toLowerCase();
		if(c.highest.has(lc)) return "highestaudio";
		if(c.lowest.has(lc)) return "lowestaudio";
		throw new RangeError('Unknown value.');
  },
  max: (val,max) => {
    return (val == "highestaudio" && max == "lowestaudio");
  }
}

const ToggleIntegerType = {
  validate: (val) => {
    const int = Number.parseInt(val);
		if(Number.isNaN(int)) return false;
    return true;
  },
  parse: (val) => {
    return Number.parseInt(val);
  },
  max: (val,max) => {
    return (max >= 0 && (val > max || val < 0));
  }
}

exports.types = {
  string: StringType,
  integer: IntegerType,
  boolean: BooleanType,
  json: JSONType,
  ytdl: YTDLType,
  toggleinteger: ToggleIntegerType
}