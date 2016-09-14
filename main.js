'use strict';

var LScpy_BeforeLastDelete; // Acts as COPY of LAST upload to LS
var EditSerial;

$(function () {
  $('button.submit-contact').on('click', submitContact);
  $('a.social-links.faceb').on('click', filterSocialButton.facebook);
  $('a.social-links.phoneN').on('click', filterSocialButton.phone);
  $('a.social-links.emailA').on('click', filterSocialButton.email);
  $('a.social-links.infoM').on('click', filterSocialButton.address_info);

  $('button.btn.btn-info.edit-contact').on('click', EditContact.edit);
});
// Recieves any/all updates: ADD, READ, WRITE & send to changes to LS.
//
// ----------- SHORTCUT BUTTONS -----------------

var filterSocialButton = {
  facebook: function(e){
    e.preventDefault();
    var $thisis = $(this).closest('a').data('id');
    var StoredFacebook = Storage.getWorkingCopy();
    var facebook;

    for(var i = 0; i<StoredFacebook.length; i++){
      if(StoredFacebook[i].serial === $thisis){
        facebook = StoredFacebook[i].facebook;
      } else {
        console.error();
      }
    };
    $('div.hidden-social').find('a.faceb').attr('href', facebook);

  },
  phone: function(e){
    e.preventDefault();
    var $thisis = $(this).closest('a').data('id');
    var StoredPhone = Storage.getWorkingCopy();
    var phone;

    for(var i = 0; i<StoredPhone.length; i++){
      if(StoredPhone[i].serial === $thisis){
        phone = StoredPhone[i].phone;
      } else {
        console.error();
      }
    };
    $('div#phoneSystemModal').find('span.phone-number').text(phone);
    $('div#phoneSystemModal').find('button.edit-contact').attr('data-id', $thisis);
  },
  email: function(e){
    e.preventDefault();
    var $thisis = $(this).closest('a').data('id');
    var StoredEmail = Storage.getWorkingCopy();
    var email;

    for(var i = 0; i<StoredEmail.length; i++){
      if(StoredEmail[i].serial === $thisis){
        email = StoredEmail[i].email;

      } else {
        console.error();
      }
    };
    $('#emailSystemModal').find('input').first().val(email);
    $('div#emailSystemModal').find('button.edit-email').attr('data-id', $thisis);
  },
  address_info: function(e){
    e.preventDefault();
    var $thisis = $(this).closest('a').data('id');
    var StoredAddress = Storage.getWorkingCopy();
    var street;
    var city;
    var state;
    var zip;
    var image;

    for(var i = 0; i<StoredAddress.length; i++){
      if(StoredAddress[i].serial === $thisis){
        street = StoredAddress[i].address_street;
        city = StoredAddress[i].address_city;
        state = StoredAddress[i].address_state;
        zip = StoredAddress[i].address_zip;
        image = StoredAddress[i].image;
      } else {
        console.error();
      }
    };
    $('#moreInfoSystemModal').find('img.info-image').attr('src', image);
    $('#moreInfoSystemModal').find('span.address-street').text(street);
    $('#moreInfoSystemModal').find('span.address-city').text(city);
    $('#moreInfoSystemModal').find('span.address-state').text(state);
    $('#moreInfoSystemModal').find('span.address-zip').text(zip);
    $('#moreInfoSystemModal').find('button.edit-contact').attr('data-id', $thisis);

  }
};

// // ----------- DELETE CONTACT -----------------
//
// var DeleteContact = {
//   delete: function(serial){
//     var currentId =
//     var workingLS = Storage.getWorkingCopy();
//     workingLS.push(contactInfo);
//     Storage.writeToLocalStorage(workingLS);
//   }
// };

// ----------- EDIT CONTACT -----------------

var EditContact = {
  edit: function(event){
    var $newDeleteButton = $('<button>').attr({
      type: "button",
      "class": "btn btn-danger delete-contact",
      "data-dismiss": "modal",
      "data-id": ""
    }).text('Delete Contact');

    var $ModalFooter = $('#addContactModal').find('div.modal-footer');

    if($ModalFooter.find('button.delete-contact').length === 0){
       $ModalFooter.append($newDeleteButton);
    };

      EditSerial = $(this).data('id');
      $('button.delete-contact').on('click', EditContact.delete(EditSerial));

  },
  delete: function(deleteSerial){
    console.log(deleteSerial);
    var indexToDelete = 0;
    var workingLS = Storage.getWorkingCopy();
    // console.log('serial @ 0 ',workingLS[0]);

        for(var i = 0; i<workingLS.length; i++){
          if(workingLS[i].serial === deleteSerial){
            console.log(i);
            indexToDelete = i ;
            console.log('indextodelete', indexToDelete);
          } else {
            console.error();
          }
        };
    LScpy_BeforeLastDelete = workingLS;
    workingLS.splice(indexToDelete, 1);
    console.log('splice', workingLS.splice(indexToDelete, 1));
    Storage.writeToLocalStorage(workingLS);
  }
};

// ----------- SUBMIT CONTACT -----------------

function submitContact(e) {
  e.preventDefault();
  console.log('wtf');
  var serial = generateDataId();

  function generateDataId() {
    return Math.floor(Math.random() * 1000);
  }
  var contactInfo = {
    serial: serial,
    name: $('input.newName')
    .val(),
    phone: $('input.newNumber')
    .val(),
    email: $('#addContactModal').find('input.newEmail')
    .val(),
    facebook: $('input.newFacebook')
    .val(),
    address_street: $('input.new-address-street')
    .val(),
    address_city: $('input.new-address-city')
    .val(),
    address_state: $('input.new-address-state')
    .val(),
    address_zip: $('input.new-address-zip')
    .val(),
    image: $('input.newImage')
    .val()
  }
  var $contactForm = $('#addContactModal')
  .clone();
  $('div.saved-contacts')
  .find('div.contactList')
  .append($contactForm);

  var $newDeleteButton = $('<button>')
  .attr({
    type: "button",
    "class": "btn btn-danger delete-contact",
    "data-dismiss": "modal"
  });
  $contactForm.removeClass('template')
  .addClass('newContact')
  .attr({
    "data-id": contactInfo.serial
  });
  $contactForm.find('div.modal-footer')
  .find('submit-contact')
  .removeClass('submit-contact')
  .addClass('edit-contact')
  .text('Submit Edit');

  $contactForm.find('div.modal-footer')
  .find('button.delete-contact')
  .remove();

  $contactForm.find('div.modal-footer')
  .find('button.edit-contact')
  .append($newDeleteButton);

  Renderer.renderImage(contactInfo.image, contactInfo.serial); // FIRST because NAME needs DOM <img> tag for traversal
  Renderer.renderName(contactInfo.name, contactInfo.serial);


  $('#addContactModal')
  .find('input.newName')
  .val('');
  $('#addContactModal')
  .find('input.newNumber')
  .val('');
  $('#addContactModal')
  .find('input.newEmail')
  .val('');
  $('#addContactModal')
  .find('input.new-address-street')
  .val('');
  $('#addContactModal')
  .find('input.new-address-city')
  .val('');
  $('#addContactModal')
  .find('input.new-address-state')
  .val('');
  $('#addContactModal')
  .find('input.new-address-zip')
  .val('');
  $('#addContactModal')
  .find('input.newImage')
  .val('');

  // console.log('old ls: ', Storage.getWorkingCopy());
  var workingLS = Storage.getWorkingCopy(); // contactsList = working copy of contacts in localStorage
  workingLS.push(contactInfo); // contactsGlobal = global var
  Storage.writeToLocalStorage(workingLS); // write contactsList (updated) to contacts in storage
  // console.log('new ls: ', Storage.getWorkingCopy());

  $('div.row').data('id', serial).closest('div.row').siblings('div.collapse').find('a.faceb:first[data-id=""]').attr('data-id', serial);
  $('div.row').data('id', serial).closest('div.row').siblings('div.collapse').find('a.phoneN:first[data-id=""]').attr('data-id', serial);
  $('div.row').data('id', serial).closest('div.row').siblings('div.collapse').find('a.emailA:first[data-id=""]').attr('data-id', serial);
  $('div.row').data('id', serial).closest('div.row').siblings('div.collapse').find('a.infoM:first[data-id=""]').attr('data-id', serial);
}
// ----------- RENDER -----------------
var Renderer = {
  renderImage: function (imageUrl, serial) {
    var $imageElement = '<img class="img-circle animated rotateIn" src="" >'; // make <img>.

    $('div.row a.add-contact:first')
    .children()
    .first()
    .remove(); // REMOVE first found info-glyph.

    $('div.row a.add-contact:first')
    .attr('data-id', serial)
    .removeClass('add-contact')
    .addClass('new-contact')
    .attr('data-toggle', 'collapse')
    .append($imageElement); // ADD <img> to the DOM.

    $('div.row')
    .data('id', serial)
    .find('a.new-contact:last')
    .find('img')
    .attr('src', imageUrl); // insert URL to <img> src attr.

    var $rowIndex = $('a.new-contact:last')
    .closest('div.contact')
    .index(); // find closest row index.
    $rowIndex++ // increase return index for zero base.

    var rowNumStr = $rowIndex.toString();
    var rowID = "hidden-row" + rowNumStr;
    // console.log(rowID);

    $('div.collapse.hidden-row').attr('id', 'hidden-row' + rowNumStr);
    // console.log($('div.collapse.hidden-row').attr('id', 'hidden-row' + rowNumStr));

    $('a').data('id', serial).attr('href', '#' + rowID);

  },
  renderName: function (name, serial) {
    $('a.new-contact:last')
    .siblings('span')
    .attr('data-id', serial);
    $('a.new-contact:last')
    .data('id', serial)
    .siblings('span')
    .text(name);
  },
  renderPhone: function (phone, serial) {
    var $phone = $('#phoneSystemModal.template')
    .clone();

    $('div.modal-appends')
    .find('div.phoneList')
    .append($phone);

    $('#phoneSystemModal.template')
    .find('span.phone-number')
    .text('');

    $phone.removeClass('template')
    .addClass('new-phone')
    .attr('data-id', serial);

    $phone.data('id', serial)
    .find('.phone-number')
    .text(phone);



    // console.log('phone added')
  },
  renderEmail: function (email, serial) {
    var $email = $('#emailSystemModal.template')
    .clone();
    $email.removeClass('template')
    .addClass('new-email')
    .attr('data_id', serial);
    $email.data('id', serial)
    .find('form.email')
    .children('input')
    .attr('placeholder', email);
  },
  renderInfo_Address: function (street, city, state, zip, serial) {
    var $address = $('#moreInfoSystemModal')
    .clone();
    $address.find('.template')
    .removeClass('.template')
    .addClass('new-adddress')
    .attr('data_id', serial)
    $address.data('id', serial)
    .find('span.address')
    .children('.address_street')
    .text(street);
    $address.data('id', serial)
    .find('span.address')
    .children('.address_city')
    .text(city);
    $address.data('id', serial)
    .find('span.address')
    .children('.address_state')
    .text(state);
    $address.data('id', serial)
    .find('span.address')
    .children('.address_zip')
    .text(zip);
  }
}
//
// var Reloader = {
//   reloadImage : function(){
//       var $imageElement = '<img class="img-circle animated rotateIn" src="" >'; // make <img>.
//
//       $('div.row a.add-contact:first')
//       .children()
//       .first()
//       .remove(); // REMOVE first found info-glyph.
//
//       $('div.row a.add-contact:first')
//       .attr('data-id', serial)
//       .removeClass('add-contact')
//       .addClass('new-contact')
//       .attr('data-toggle', 'collapse')
//       .append($imageElement); // ADD <img> to the DOM.
//
//       $('div.row')
//       .data('id', serial)
//       .find('a.new-contact:last')
//       .find('img')
//       .attr('src', imageUrl); // insert URL to <img> src attr.
//
//       var $rowIndex = $('a.new-contact:last')
//       .closest('div.contact')
//       .index(); // find closest row index.
//       $rowIndex++ // increase return index for zero base.
//
//       var rowNumStr = $rowIndex.toString();
//       var rowID = "hidden-row" + rowNumStr;
//       // console.log(rowID);
//
//       $('div.collapse.hidden-row').attr('id', 'hidden-row' + rowNumStr);
//       // console.log($('div.collapse.hidden-row').attr('id', 'hidden-row' + rowNumStr));
//
//       $('a').data('id', serial).attr('href', '#' + rowID);
//
//     },
//   },
//   reloadName: function(){},
//   reloadPhone: function(){},
//   reloadEmail: function(){},
//   reloadAddres: function(){},
//   reloadFacebook: function(){},
//   reloadImage: function(){}
// }

// ----------- CONTACT STORAGE -----------------
var Storage = {
  getWorkingCopy: function () {
    try {
      var currentLS = JSON.parse(localStorage.contacts);
    } catch (err) {
      var currentLS = [];
      // console.log(err);
    }
    var workingLS = currentLS;
    return workingLS;
  },
  writeToLocalStorage: function (workingLS) {
    var LScpy_AfterSplice = workingLS;
    localStorage.contacts = JSON.stringify(workingLS);
  }
}

// foo bar Docblockr:Decorate
