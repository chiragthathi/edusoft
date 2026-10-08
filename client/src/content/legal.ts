/**
 * Legal documents as published on edusofthealth.com (privacy-policy.php,
 * terms-and-condition.php, cookie-policy.php), restructured for the web.
 * Wording is Edusoft's; only obvious typos were corrected ("webste").
 * ⚠ Review item: the Terms list contact addresses at @a2zok.com — confirm
 *   with Edusoft's legal team before launch (see docs/UI_TRANSFORMATION.md).
 */
export interface LegalSection { h: string; p?: string[]; list?: string[] }
export interface LegalDoc { title: string; intro: string[]; sections: LegalSection[] }

export const LEGAL: Record<'privacy' | 'terms' | 'cookies', LegalDoc> = {
  privacy: {
    title: 'Privacy Policy',
    intro: [
      'At Edusoft Healthcare, accessible from https://edusofthealth.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Edusoft Healthcare and how we use it.',
      'If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.',
      'This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Edusoft Healthcare. This policy is not applicable to any information collected offline or via channels other than this website.',
    ],
    sections: [
      { h: 'Consent', p: ['By using our website, you hereby consent to our Privacy Policy and agree to its terms.'] },
      { h: 'Information we collect', p: [
        'The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.',
        'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.',
        'When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.',
      ] },
      { h: 'How we use your information', p: ['We use the information we collect in various ways, including to:'], list: [
        'Provide, operate, and maintain our website',
        'Improve, personalize, and expand our website',
        'Understand and analyze how you use our website',
        'Develop new products, services, features, and functionality',
        'Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes',
        'Send you emails',
        'Find and prevent fraud',
      ] },
      { h: 'Log Files', p: ['Edusoft Healthcare follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services’ analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users’ movement on the website, and gathering demographic information.'] },
      { h: 'Cookies and Web Beacons', p: ['Like any other website, Edusoft Healthcare uses ‘cookies’. These cookies are used to store information including visitors’ preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users’ experience by customizing our web page content based on visitors’ browser type and/or other information.'] },
      { h: 'Advertising Partners Privacy Policies', p: [
        'Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Edusoft Healthcare, which are sent directly to users’ browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.',
        'Note that Edusoft Healthcare has no access to or control over these cookies that are used by third-party advertisers.',
      ] },
      { h: 'Third Party Privacy Policies', p: [
        'Edusoft Healthcare’s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.',
        'You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers’ respective websites.',
      ] },
      { h: 'CCPA Privacy Rights (Do Not Sell My Personal Information)', p: ['Under the CCPA, among other rights, California consumers have the right to:'], list: [
        'Request that a business that collects a consumer’s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.',
        'Request that a business delete any personal data about the consumer that a business has collected.',
        'Request that a business that sells a consumer’s personal data, not sell the consumer’s personal data.',
        'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.',
      ] },
      { h: 'GDPR Data Protection Rights', p: ['We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:'], list: [
        'The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.',
        'The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.',
        'The right to erasure – You have the right to request that we erase your personal data, under certain conditions.',
        'The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.',
        'The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.',
        'The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.',
        'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.',
      ] },
      { h: 'Children’s Information', p: [
        'Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.',
        'Edusoft Healthcare does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.',
      ] },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: ['Welcome to the Edusoft Healthcare website. By accessing and using this website, you agree to the following terms and conditions:'],
    sections: [
      { h: '1. Identity', p: ['Edusoft Healthcare Ltd., B-83, Mangolpuri Industrial Area, Phase-II, New Delhi-110034. Phone number: 8851-248073. Toll Free: 1800-120-280-280. Email: care@a2zok.com', 'The Company publishing this Website belongs to the Edusoft Healthcare.'] },
      { h: '2. Information About Activities', p: ['This Website presents information concerning certain activities of the Company. The Company may modify the information contained in this Website at any time and without prior notice. This information is provided as general information without any guarantees that it is fit for any specific purpose.'] },
      { h: '3.1 Company Property', p: [
        'All information or documents (text, animated or static images, databases, sounds, photographs, know-how or cited products) stored in the Website as well as all elements created for the Website and its general structure are either the property of the Company or the companies within the Edusoft or are subject to rights to use, duplicate or communicate to the public that have been granted to such.',
        'This information, documents and items are subject to laws protecting copyright insofar as they have been made available to the public via this Website. No license or any right other than to view the Website has been granted to any party with regard to intellectual property rights.',
        'Duplication of Website documents is authorised solely as information for personal and private usage. Any duplication or usage of copies made for other purposes is formally prohibited and subject to prior and formal authorisation by the Company. In all cases, authorised duplication of information stored in this Website must cite the source and make adequate references as to ownership.',
      ] },
      { h: '3.2 Distinguishing Marks', p: ['Unless otherwise stipulated, company names, logotypes, products and brands quoted on the Website are the property of the Company or the companies within the Edusoft or are subject to rights to use, duplicate or represent/communicate to the public that have been granted to such Company or companies. You may not use them without prior written authorisation from the Company.'] },
      { h: '3.3 Databases', p: ['The Company is the controller of databases on the Website and the Company is the owner of any databases made available. You may not extract or reuse a substantial qualitative or quantitative portion of the databases, including for private purpose.'] },
      { h: '4.1 Right to Use Information', p: ['Each visitor to the Website who provides information grants the Company all transferable rights concerning said information and authorises the Company to make use of said information. Information provided by visitors shall be deemed not confidential. However, the information provided is personal data as defined by applicable law, which means we undertake to process said information in accordance with our Personal data and cookies charter which applies to this Website.'] },
      { h: '4.2 Compliance with Law', p: ['Each visitor to this Website also certifies that he or she complies with these measures and current laws and in particular:'], list: [
        'Has the ability and means required to access the Website and use it.',
        'Has verified that the IT configuration used does not contain any virus and that it is in full working order.',
        'Grants the Company and partners where applicable a right to use the information provided (other than data of a personal nature).',
        'Must keep confidential and is consequently liable for the use and security of access codes and passwords that the Company may send you to access specific sections. The Company reserves the right to suspend your access to the Website in the event of fraudulent use or attempts at fraudulent use of said access.',
      ] },
      { h: '5. Hypertext Links', p: [
        'Activation of links. The Company formally declines any liability as to the content of websites to which it provides links. Said links are offered to users of this Website as a service. Please consult the general terms and conditions and the Personal data and cookies charter for the websites in order to understand their practice. The decision to use links is made solely by the Website users. We may modify or delete a link on this Website at any moment.',
        'Link authorisation. If you wish to create a hypertext link to this Website, you must obtain prior written authorisation from the Company using the contact details provided at the end of this document.',
      ] },
      { h: '6.1 Information', p: [
        'The information (“Information”) available on this www (World Wide Web) server is provided in good faith.',
        'This Information is considered correct when it is published on the Website. However, the Company neither represents nor guarantees that the Information is comprehensive or accurate. You bear all the risks arising from your reliance on the Information. The Information is provided on the condition that you or any other person receiving it can determine its suitability for a specific purpose before use. Under no circumstances will the Company accept liability for injury arising from reliance on the said Information, its use or use of a product to which it refers.',
        'The Information shall not be deemed a recommendation to use information, products, procedures, equipment or formulae contravening a patent, copyright or registered trade mark. The Company declines any explicit or implicit liability in the event that use of the Information contravenes a patent, copyright or registered trade mark.',
        'The Company and all directly or indirectly owned subsidiaries or affiliates categorically rejects any interpretation which may assimilate the content of its websites to purchase offers or incitements to acquire shares or other listed or unlisted negotiable securities.',
        'No explicit or implicit guarantee is given regarding the commercial nature of the Information provided or its suitability for a given purpose as well as the products to which said Information refers to.',
        'Under no circumstances does the Company undertake to update or correct the Information disseminated on the internet or on its web servers. Similarly, the Company reserves the right to amend or correct the content of its Website at any time without prior notification.',
      ] },
      { h: '6.2 Forward-Looking Statements', p: ['The Information presented in this Website may contain forward-looking statements concerning the financial position, operating results, activities and industrial strategy of the Company. Such statements are subject to risks and uncertainties. These statements are based on the beliefs and assumptions of management and on the information currently available to management. Forward-looking statements are not assurances of results or values. They involve risks, uncertainties and assumptions. Future results may differ materially from those expressed in these forward-looking statements. Many of the factors that will determine these results and values are beyond the Company’s ability to control or predict.'] },
      { h: '6.3 Availability', p: ['The Company does not guarantee that the Website will operate without interruption or that the servers ensuring access to it operate and/or the third party sites to which hypertext links refer do not contain viruses.'] },
      { h: '7. Updates and Applicable Law', p: ['The Company may update these General Terms and Conditions of Use of the Website at any time. Consequently, you are invited to regularly refer to the latest General Terms and Conditions of Use in effect. These General Terms and Conditions of Use of the Website are subject to applicable laws.'] },
      { h: '8. Contact Details', p: ['You may direct all questions concerning conditions of use of the Website by e-mail to it.edusoft@a2zok.com or by post to: Edusoft Healthcare Ltd., B-83, Mangolpuri Industrial Area, Phase-II, New Delhi-110034. Phone number: 8851-248073. Toll Free: 1800-120-280-280.'] },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro: ['This Cookie Policy explains what cookies are and how we use them, the types of cookies we use i.e., the information we collect using cookies and how that information is used, and how to control the cookie preferences. For further information on how we use, store, and keep your personal data secure, see our Privacy Policy.'],
    sections: [
      { h: 'What are cookies?', p: ['Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs and to analyze what works and where it needs improvement.'] },
      { h: 'How do we use cookies?', p: [
        'As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.',
        'The third-party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure, providing advertisements that are relevant to you, and all in all providing you with a better and improved user experience and help speed up your future interactions with our website.',
      ] },
      { h: 'What types of cookies do we use?', list: [
        'Essential: Some cookies are essential for you to be able to experience the full functionality of our site. They allow us to maintain user sessions and prevent any security threats. They do not collect or store any personal information.',
        'Statistics: These cookies store information like the number of visitors to the website, the number of unique visitors, which pages of the website have been visited, the source of the visit, etc. These data help us understand and analyze how well the website performs and where it needs improvement.',
        'Marketing: Our website displays advertisements. These cookies are used to personalize the advertisements that we show to you so that they are meaningful to you. These cookies also help us keep track of the efficiency of these ad campaigns.',
        'Functional: These are the cookies that help certain non-essential functionalities on our website. These functionalities include embedding content like videos or sharing content of the website on social media platforms.',
        'Preferences: These cookies help us store your settings and browsing preferences like language preferences so that you have a better and efficient experience on future visits to the website.',
      ] },
      { h: 'How can I control the cookie preferences?', p: ['Different browsers provide different methods to block and delete cookies used by websites. You can change the settings of your browser to block/delete the cookies. To find out more about how to manage and delete cookies, visit wikipedia.org or www.allaboutcookies.org.'] },
    ],
  },
};
