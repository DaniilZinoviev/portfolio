<?php

class Contact {

	/**
	 * @var number Minimal time to be on the page before submit
	 */
	public $minTimeOnPage = 5;

    /**
     * @var array
     */
    protected $result;

    /**
     * Constructor
     *
     * @param array $request
     */
    public function __construct(array $request)
    {
        $name       = (string) strip_tags($request['name']);
        $email      = (string) strip_tags($request['email']);
        $message    = (string) strip_tags($request['message']);

        $honeypot = (int) isset($request['honeypot']) ? $request['honeypot'] : null;

        $errors = $this->validate($name, $email, $message, $honeypot);

        if (!empty($errors)) {
            $this->result = [
                'success' => false,
                'message' => trim(implode('; ', $errors))
            ];
            return;
        }

        $result = $this->send($name, $email, $message, $honeypot);

        if ($result) {
            $this->result = [
                'success' => true,
                'message' => 'The message has been successfully sent to delivery'
            ];
        } else {
            $this->result = [
                'success' => false,
                'message' => 'The message has been declined by delivery'
            ];
        }
    }

    /**
     * Validate input data
     *
     * @param string $name
     * @param string $email
     * @param string $message
     * @param int $honeyPot
     */
    public function validate(string $name, string $email, string $message, int $honeypot)
    {
        $errors = [];

        if (! $name || ! $email || ! $message) {
            $errors[] = 'Error: not enough fields has been submitted!';
        }

        
    	if (time() < ($honeypot + $this->minTimeOnPage)) {
    		$time = time();
    		$errors[] = "Error: spam message detected! {$honeypot} and {$this->minTimeOnPage} is < then {$time}";
    	}

        return $errors;
    }
    
    /**
     * Sends an email to the site owner
     *
     * @param string $name
     * @param string $email
     * @param string $message
     */
    public function send(string $name, string $email, string $message, int $honeypot = null)
    {
        $to      = 'danzino21@gmail.com';
        $subject = 'Contact form from the danzino.com';
        $message = "Name: $name\n\nEmail: $email\n\nMessage:\n$message\n\n\n\n";

        if ($honeypot) {
        	$message .= sprintf('(Submitted in %d seconds after page has been loaded.)', time() - $honeypot);
        }

        $headers = 'From: danzino.com' . "\r\n" .
            'Reply-To: danzino.com' . "\r\n" .
            'X-Mailer: PHP/' . phpversion();

        return mail($to, $subject, $message, $headers);
    }

    /**
     * Returns a result of a mail operation
     *
     * @return array
     */
    public function getResult()
    {
        return $this->result;
    }
}

if (isset($_POST['request'])) {
    $contact = new Contact($_POST['request']);
    $result = $contact->getResult();
    echo json_encode($result);
}