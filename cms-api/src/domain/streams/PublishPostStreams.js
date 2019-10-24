module.exports = (post) => {
  const {
    locationDetails:{
      city,
      region,
      province,
      country,
      district,
      barangay,
      locationLevel,placeId
    }
  } = post;

  const nullable = (value) => {
    return typeof value === 'undefined' ? null : value
  }

  return {
    postId: post.postId,
    postTitle: post.title,
    postFullContent: post.content,
    postTechnicalTags: null,
    postOperationalTags: null,
    postKeywords: [],
    postAcceptedKeywords: [],
    postRejectedKeywords: [],
    postAddedKeywords: [],
    postLocation:{
      locationAddress: post.locationAddress, 
      lat: post.locationDetails.lat, 
      long: post.locationDetails.lng,
    },
    postCountry: nullable(country),
    postRegion: nullable(region), 
    postProvince: nullable(province), 
    postCity: nullable(city), 
    postDistrict: nullable(district), 
    postBarangay: nullable(barangay),
    locationLevel, 
    placeId,
    postTimestampPosted: post.publishedAt,
    postTimestampEvent: null,
    postTimestampUpdated: null,
    postCommunityID: null,
    postExpirationDate: null,
    postWordCount: post.title.split(' ').length,
    postCategories: post.category,
    postSubCategory: post.subCategory,
    sensitivityFlag: null,
    sensitivityType: null,
    sensitivityTypeTimestamp: null,
    dialectTag: null,
    priorityTag: post.priorityLevel,
    sponsorFlag: null,
    sponsorName: null,
    sponsorType: null,
    postType: "Text",
    postSourceType: "Writer/Editor",
    postSource: "Juan Dela Cruz",
    postAgeRestriction: null,
    postGenderRestriction: null,
    postTarget: null,
    postDeviceType: null,
    postDeviceBrand: null,
    postDeviceModel: null,
    postDeviceOS: null,
    postDeviceOSVersion: null,
    postNetworkRestriction: null,
    postTimeOfDay: null,
    postDayOfWeek: null,
    postOtherRestriction: null,
    postStatus: "Active",
    reportedFlag: null,
    postScore: null
  };
};