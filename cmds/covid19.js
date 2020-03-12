/**
 * THIS CODE WAS MADE FOR THE DSA DISCORD BOT AND CAN BE REUSED FOR ANY PURPOSE WITHOUT CREDIT. FOR FULL LEGAL AND LICENSING DISCLAIMERS, PLEASE READ LEGAL.TXT.
 * 
 * A COVID-19 information command. Scrapes data using novelcovid to gather live data regarding the virus. Also includes information regarding the virus itself.
 * 
 * ~~~developed by ggtylerr~~~
 */

const Discord = require('discord.js');
const covid = require('novelcovid');

// NOTE: Rushed program. Will clean whenever I can.

exports.run = (client, message, args) => {
  covid.all().then((allData) => {
    covid.countries().then((countryData) => {
      var embed;
      usa = countryData[countryData.findIndex(x => x.country === 'USA')];
      embed = new Discord.RichEmbed()
        .setColor('#ff2c07')
        .setTitle('COVID-19/Coronavirus Information')
        .setURL('https://www.cdc.gov/coronavirus/2019-ncov/index.html')
        .setAuthor('Provided by DSA Bot',client.user.avatarURL,'https://www.cdc.gov/coronavirus/2019-ncov/index.html')
        .setDescription('Coronavirus disease 2019 (COVID-19) is an infectious disease caused by SARS-CoV-2. Common symptops include fever, cough, and shortness of breath. Muscle pain, sputum production and sore throat are some of the less common symptons. While the majority of cases result in mild symptons, some progress to pneumonia and multi-organ failure. The case fatality rate is estimated at between 1% and 5% but varies by age and other health conditions.')
        .setThumbnail('https://images.newscientist.com/wp-content/uploads/2020/01/27123401/f0070229-coronavirus_artwork-spl.jpg')
        .addField('Global Cases','Total: ' + allData.cases + '\nActive: ' + (allData.cases - (allData.deaths + allData.recovered)) + '\nRecovered: ' + allData.recovered + '\nDeaths: ' + allData.deaths,true)
        .addField('USA Cases','Total: ' + usa.cases + '\nActive: ' + (usa.cases - (usa.deaths + usa.recovered)) + '\nRecovered: ' + usa.recovered + '\nDeaths: ' + usa.deaths + '\nCritical: ' + usa.critical + '\nCases Today: ' + usa.todayCases + '\nDeaths Today: ' + usa.todayDeaths,true)
        .setTimestamp()
        .setFooter('For more information, please visit the CDC website. URL at the top of this message. \nUpdated on:');
      message.channel.send(embed);
    }).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
}