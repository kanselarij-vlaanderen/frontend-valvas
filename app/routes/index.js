import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    search: {
      refreshModel: true
    },
    startDate: {
      refreshModel: true
    },
    endDate: {
      refreshModel: true
    }
  },

  model(/*params*/) {
    const mockJsonNewsletterInfo =   {
      count: 4,
      data: [
        {
          type: "newsletterInfo",
          id: 111,
          attributes: {
            title: "First title",
            richtText: "This is the <b>text</b> of the <b>first</b> newsletter info.",
            text: "This is the text of the first newsletter info.",
            publicationDate: "2016-03-12T00:00:00+00:00",
            mandateeProposal: "Martha Martha",
            documents: [ "document 1", "document 2" ]
          }
        },
        {
          type: "newsletterInfo",
          id: 222,
          attributes: {
            title: "Second title",
            richtText: "",
            text: "This is the text of the second newsletter info. I don't have any rich text version, sorry about that! I am also going to be very long. I need to be at least 501 characers, so that we can test the Lees Meer option. That's a long way to go. I don't have any rich text version, sorry about that! I am also going to be very long. I need to be at least 501 characers, so that we can test the Lees Meer option. That's a long way to go.  I don't have any rich text version, sorry about that! I am also going to be very long. I need to be at least 501 characers, so that we can test the Lees Meer option. That's a long way to go. ",
            publicationDate: "2017-06-26T00:00:00+00:00",
            mandateeProposal: "Paul Paul",
            documents: []
          }
        },
        {
          type: "newsletterInfo",
          id: 333,
          attributes: {
            title: "Third title",
            richtText: "This is the <b>text</b> of the <b>third</b> newsletter info.",
            text: "This is the text of the third newsletter info.",
            publicationDate: "2019-08-01T00:00:00+00:00",
            mandateeProposal: "Catherine Catherine",
            documents: []
          }
        },
        {
          type: "newsletterInfo",
          id: 444,
          attributes: {
            title: "Fourth title",
            richtText: "This is the <b>text</b> of the <b>fourth</b> newsletter info.",
            text: "This is the text of the fourth newsletter info.",
            publicationDate: "2018-12-19T00:00:00+00:00",
            mandateeProposal: "Jean Jean",
            documents: []
          }
        }
      ]

    };
    return mockJsonNewsletterInfo;
  }
});
